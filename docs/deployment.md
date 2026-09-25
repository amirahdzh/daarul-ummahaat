# Deployment Guide

Everything needed to run the website on your OVH VPS, with automatic deploys from GitHub. Follow the parts in order. Commands are meant to be copied as they are; replace anything in `<angle brackets>`.

## How it works

```text
You push to main on GitHub
        ↓
GitHub Actions: lint, types, tests, migration check, build
        ↓
Builds a Docker image and stores it in GitHub's registry (ghcr.io, private)
        ↓
Connects to the VPS over SSH as the "deploy" user and runs /opt/daarul/deploy.sh
        ↓
deploy.sh: safety dump of the database → pull image → restart → wait for health check
           → automatic rollback to the previous image if the new one does not come up

On the VPS (Docker Compose, in /opt/daarul):

  Internet → [Cloudflare] → Caddy (HTTPS) → app (Payload + Next.js) → Postgres
                                              │
                                              └─ uploaded photos: Docker volume "media"

Every night (systemd timer): Postgres dump + media → encrypted → Cloudflare R2
```

| Where | What |
|---|---|
| GitHub | Code, workflow, deploy secrets (SSH key, host address), image registry |
| VPS `/opt/daarul` | `docker-compose.yml`, `Caddyfile`, scripts (uploaded by each deploy) and **`.env` (secrets, created by you, never in git)** |
| Docker volumes | `daarul_pgdata` (database), `daarul_media` (photos and documents), `daarul_caddy_data` (HTTPS certificates) |
| Cloudflare R2 | Encrypted nightly backups |

**Tested locally before writing this guide:** the image builds without a database, the whole stack starts through the real deploy script, migrations run on an empty database, the first administrator is created, uploads and image resizing work, a broken release rolls back automatically, and a backup followed by a full restore brings back both the database and photos. **Not testable without your accounts:** GitHub Actions itself, GHCR, Let's Encrypt, Cloudflare R2. The first real run of each is in this guide, with what to check.

## Checklist (details below)

- [ ] Part 1: VPS prepared (user, SSH hardening, firewall, Docker)
- [ ] Part 2: Cloudflare R2 bucket and API token
- [ ] Part 3: GitHub repository, deploy SSH key, secrets
- [ ] Part 4: `/opt/daarul/.env` created, DNS points at the VPS, first deploy
- [ ] Part 5: Backups running, restore tested
- [ ] Part 6: Cloudflare in front (when you move DNS)
- [ ] Optional: uptime monitor, Cloudflare Access on `/admin`

---

## Part 1: Prepare the VPS (once)

These assume Ubuntu or Debian. Log in with the account OVH gave you (it has `sudo`).

### 1.1 Update, timezone, swap

```bash
sudo apt-get update && sudo apt-get -y upgrade
sudo timedatectl set-timezone Asia/Jakarta
```

A small swap file protects the 4 GB machine from running out of memory while images are pulled:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 1.2 Create the `deploy` user

GitHub Actions uses this account. It is separate from your own login so its key can be revoked on its own.

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo install -d -o deploy -g deploy /opt/daarul
```

You will add its public key in Part 3. Keep your own SSH access with your own key.

### 1.3 Harden SSH

Only do this once you can log in with an SSH key. Keep your current session open until step 3 succeeds.

```bash
sudo tee /etc/ssh/sshd_config.d/99-hardening.conf >/dev/null <<'EOF'
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
EOF
sudo sshd -t && sudo systemctl reload ssh
```

Then, **from a new terminal on your computer**, confirm you can still log in before closing the old session.

### 1.4 Firewall, brute-force protection, automatic security updates

```bash
sudo apt-get install -y ufw fail2ban unattended-upgrades
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw --force enable
sudo systemctl enable --now fail2ban
sudo dpkg-reconfigure -plow unattended-upgrades   # answer Yes
```

If your SSH is on a port other than 22, allow that port instead of `OpenSSH`. Docker publishes only ports 80 and 443; the database has no published port.

### 1.5 Install Docker

```bash
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
. /etc/os-release
sudo curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID $VERSION_CODENAME stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker deploy
docker --version && docker compose version
```

> The `docker` group can control the whole machine. Treat the deploy SSH key like a root password.

---

## Part 2: Cloudflare R2 bucket for backups (once)

1. Cloudflare dashboard → **R2 Object Storage** → **Create bucket**. Name: `daarul-backups`. Leave the location on automatic and the bucket **private**.
2. R2 overview → **Manage API tokens** → **Create API token**. Permission **Object Read & Write**, limited to the `daarul-backups` bucket only.
3. Write down the three values shown once: **Access Key ID**, **Secret Access Key**, and the **Account ID** (in the R2 overview and in the endpoint URL).
4. Generate the backup encryption password and store it in your password manager **now**. Without it the backups cannot be restored:

   ```bash
   openssl rand -base64 32
   ```

You will paste these into `.env` in Part 4.

---

## Part 3: GitHub (once)

### 3.1 Repository

Create a **private** repository, then from your computer:

```bash
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

Do the rest of this part before relying on the deploy. The first push will run the checks, and the deploy job will fail until the secrets exist, which is harmless.

### 3.2 Deploy SSH key

On your computer:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/daarul_deploy -C "github-actions-deploy" -N ""
cat ~/.ssh/daarul_deploy.pub
```

On the VPS, add the **public** key to the `deploy` user (paste the whole line):

```bash
echo "<paste the public key line>" | sudo tee -a /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Check it works from your computer (should print the folder listing, no password prompt):

```bash
ssh -i ~/.ssh/daarul_deploy deploy@<VPS_IP> 'ls -ld /opt/daarul && docker ps'
```

### 3.3 Pin the server's identity

This makes GitHub refuse to deploy to an impostor server.

```bash
ssh-keyscan -t ed25519 <VPS_IP>
```

Copy the whole output line (starts with the IP). To be sure it is really your server, compare fingerprints. This should print the same fingerprint as running `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on the VPS:

```bash
ssh-keyscan -t ed25519 <VPS_IP> 2>/dev/null | ssh-keygen -lf -
```

### 3.4 Secrets

Repository → **Settings → Environments → New environment** → name it `production`. Optional but recommended: tick **Required reviewers** and add yourself, so every deploy waits for your click.

In that environment add these **secrets**:

| Secret | Value |
|---|---|
| `VPS_HOST` | The VPS IP address or hostname. Must be exactly what you used in `ssh-keyscan` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | The whole content of `~/.ssh/daarul_deploy` (the **private** key, including the `BEGIN` and `END` lines) |
| `VPS_HOST_KEY` | The line copied in 3.3 |
| `VPS_PORT` | Only if SSH is not on port 22 |

You can add this **variable** later, once the domain works (Part 4): `SMOKE_TEST_URL` = `https://<your-domain>`. Each deploy then finishes by checking the public site.

Then delete the private key from your computer if you do not need it: `shred -u ~/.ssh/daarul_deploy`. GitHub has its own copy.

---

## Part 4: First deploy

### 4.1 Create the server's `.env`

This holds every secret the server needs. It never goes to GitHub. Only the `deploy` user can read it, so **from here on, run all commands in `/opt/daarul` as that user**: `sudo -iu deploy` (type `exit` to come back).

Use an admin password **without** `$`, `#`, quotes or backslashes, because this file is read by Docker Compose, which treats them specially. On the VPS, as your normal user:

```bash
read -rp "Domain, without https:// or www (for example daarulummahaat.org): " DOMAIN
read -rp "Email for HTTPS certificate notices: " ACME_EMAIL
read -rp "First admin email: " ADMIN_EMAIL
read -rsp "First admin password (at least 12 characters): " ADMIN_PW; echo

sudo -u deploy bash -c 'umask 077 && cat > /opt/daarul/.env' <<EOF
DOMAIN=$DOMAIN
ACME_EMAIL=$ACME_EMAIL
SITE_URL=https://$DOMAIN
POSTGRES_PASSWORD=$(openssl rand -hex 24)
PAYLOAD_SECRET=$(openssl rand -hex 32)
CONTACT_TO_EMAIL=
INITIAL_ADMIN_EMAIL=$ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD=$ADMIN_PW
RESTIC_REPOSITORY=
RESTIC_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
HEALTHCHECK_URL=
BACKUP_KEEP_DAILY=7
BACKUP_KEEP_WEEKLY=4
EOF
sudo ls -l /opt/daarul/.env      # should show -rw------- deploy
```

The R2 lines are filled in during Part 5. Nothing else needs editing.

### 4.2 Point the domain at the VPS

At Hostinger (DNS zone of your domain, before moving DNS to Cloudflare), create or change:

| Type | Name | Value |
|---|---|---|
| A | `@` | the VPS IPv4 address |
| A | `www` | the VPS IPv4 address |

If the domain currently serves something else (an existing Hostinger site), this replaces it. Do not touch the mail records (MX, SPF, DKIM).

Wait until this shows your VPS address (may take minutes to an hour):

```bash
dig +short <your-domain>
```

Caddy needs this to obtain the HTTPS certificate on first start.

### 4.3 Deploy

Push to `main`, or open the repository → **Actions → CI and deploy → Run workflow**. Watch the run. The order is: checks (about 3 minutes), image build (about 4 minutes the first time, faster after), then deploy.

### 4.4 Check it

On the VPS, as the deploy user (`sudo -iu deploy`):

```bash
cd /opt/daarul
./dc ps                       # app (healthy), db (healthy), caddy
./dc logs --tail 40 app
curl -I https://<your-domain>/healthz
```

Open `https://<your-domain>/admin` and log in with the first admin account.

**Then, immediately, remove the bootstrap password from the server:**

```bash
cd /opt/daarul
sed -i '/^INITIAL_ADMIN_/d' .env
./dc up -d app
```

Finally, add the `SMOKE_TEST_URL` variable in GitHub (3.4) and add the rest of the site content in the admin.

### 4.5 If something is off

| Symptom | Likely cause and fix |
|---|---|
| Actions fails at "Upload deployment files" | Wrong `VPS_HOST`, `VPS_USER` or key. Re-run the check in 3.2. `/opt/daarul` must be owned by `deploy` (1.2) |
| "Host key verification failed" | `VPS_HOST_KEY` does not match `VPS_HOST`. Redo 3.3 |
| Actions fails with "Missing /opt/daarul/.env" | Do 4.1 first |
| `./dc logs caddy` shows certificate errors | DNS does not point at the VPS yet (4.2), or ports 80 and 443 are blocked. Check `sudo ufw status` and OVH's firewall |
| Deploy says "did not become healthy" and rolls back | Read the log lines it prints, or `./dc logs app`. Usually a wrong value in `.env` |
| Admin login page shows "create first user" | The bootstrap variables were empty. Fill `INITIAL_ADMIN_*`, `./dc up -d app`, then remove them again |

---

## Part 5: Backups

### 5.1 Add the R2 values

```bash
cd /opt/daarul
nano .env
```

Fill in (from Part 2). The repository line has your Account ID and bucket name:

```text
RESTIC_REPOSITORY=s3:https://<ACCOUNT_ID>.r2.cloudflarestorage.com/daarul-backups
RESTIC_PASSWORD=<the password from Part 2>
AWS_ACCESS_KEY_ID=<R2 Access Key ID>
AWS_SECRET_ACCESS_KEY=<R2 Secret Access Key>
```

### 5.2 First backup, by hand

```bash
cd /opt/daarul
./dc --profile tools run --rm backup
```

It creates the encrypted repository, uploads the database dump and photos, applies retention (7 daily, 4 weekly) and checks a sample of the data. You should end with `Backup finished`. This is the first real contact with R2, so if it fails, the message says why (usually a typo in the four values above).

```bash
./dc --profile tools run --rm backup restic snapshots     # lists what is stored
```

### 5.3 Schedule it (every night at 03:15, server time)

Run this as your normal admin user (it needs `sudo`), after the first deploy has uploaded the files:

```bash
sudo cp /opt/daarul/systemd/daarul-backup.service /opt/daarul/systemd/daarul-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now daarul-backup.timer
systemctl list-timers daarul-backup.timer          # shows the next run
sudo systemctl start daarul-backup.service         # optional: run it now through systemd
journalctl -u daarul-backup.service -n 30 --no-pager
```

### 5.4 Get alerted when a backup fails or does not run

Create a free check at healthchecks.io (period 1 day, grace 2 hours), copy its ping URL, and put it in `.env`:

```text
HEALTHCHECK_URL=https://hc-ping.com/<uuid>
```

The backup pings it on start, on success, and on failure. No ping means you get an email.

### 5.5 Practise a restore

Do this once before you rely on backups, ideally after you have a little content:

```bash
cd /opt/daarul
./dc --profile tools run --rm backup restic snapshots      # find a snapshot ID, or use "latest"
./restore.sh latest                                        # asks you to type RESTORE
```

It saves the current database first (`backups/pre-restore-*.dump`), stops the app, restores database and photos from the backup, and starts the app again. The site is unavailable for about a minute.

There are two other safety nets in `/opt/daarul/backups`: a database dump is saved before every deploy (the last five are kept), and the OVH daily snapshot covers the whole machine for 24 hours.

---

## Part 6: Cloudflare in front (when you move DNS)

The site works without this; Cloudflare adds caching, DDoS protection and hides the server address.

1. Add the domain to Cloudflare (free plan) and let it import the DNS records. **Check that MX, SPF, DKIM and every mail-related record were imported and are set to "DNS only" (grey cloud).** Set the `A` records for `@` and `www` to **Proxied** (orange cloud). See the DNS steps in `docs/architecture-decision.md`, section 8.
2. Change the nameservers at Hostinger's domain page to the two Cloudflare gave you.
3. **SSL/TLS → Overview:** mode **Full (strict)**. **Edge Certificates:** turn on **Always Use HTTPS**.
4. **Caching → Cache Rules**, create two rules:
   - **Photos:** if the URI path starts with `/api/media/file/` or `/api/gallery-images/file/` → *Eligible for cache*, Edge TTL: *Use cache-control header if present*, Browser TTL: *Respect origin*.
   - **Pages:** if the hostname equals your domain **and** the URI path does not start with `/admin`, `/api`, `/_next` or `/healthz` → *Eligible for cache*, Edge TTL: *Ignore cache-control header and use this TTL* → 1 minute for status 200, **no store** for status 404 and 5xx. Browser TTL: *Respect origin*.

   Effect: edits show on the website within about a minute, and most visits never reach the VPS.
5. Optional, recommended after everything works: let only Cloudflare reach ports 80 and 443. Cloudflare publishes its address ranges at `https://www.cloudflare.com/ips/`. Skip this if you also want direct access.
6. Optional: **Zero Trust → Access** can put a login in front of `/admin` (free for small teams), on top of the CMS's own login.

---

## Part 7: Everyday operations

All commands run on the VPS in `/opt/daarul`, as the `deploy` user (`sudo -iu deploy`). Use `./dc` instead of `docker compose`.

| Task | Command |
|---|---|
| Status | `./dc ps` |
| Live logs | `./dc logs -f app` (also `caddy`, `db`) |
| Memory and CPU | `docker stats --no-stream` |
| Disk space | `df -h /` and `docker system df` |
| Database shell | `./dc exec db psql -U daarul daarul` |
| Backup now | `./dc --profile tools run --rm backup` |
| List backups | `./dc --profile tools run --rm backup restic snapshots` |
| Restore | `./restore.sh latest` |
| Change a setting | edit `.env`, then `./dc up -d` |
| Restart the app | `./dc restart app` |

**Release a change:** merge or push to `main`. The site updates itself. There is no other step.

**Roll back a bad release by hand:** each deploy leaves the previous image on the server for 7 days.

```bash
docker images --format '{{.Repository}}:{{.Tag}}   {{.CreatedSince}}' | grep ghcr.io
DEPLOY_SKIP_PULL=1 ./deploy.sh ghcr.io/<owner>/<repo>:<older-sha>
```

Or, in GitHub, revert the commit on `main`; the deploy that follows is the rollback. Rolling back an image does not undo a database change; if a bad migration ran, use `./restore.sh` or the `backups/pre-deploy-*.dump` file.

**Changing what the admin can edit (collections and fields):**

```bash
pnpm payload migrate:create <short-name>     # on your computer, after changing the collection code
git add src/migrations && git commit ...
```

GitHub's checks fail if you forget this step. The migration runs by itself when the new version starts.

**Updates:** Dependabot opens weekly pull requests for dependencies. Merging one deploys it after the checks pass. Operating system updates install automatically (1.4); reboot occasionally (`sudo reboot`) when `/var/run/reboot-required` exists.

**Rotate a secret:** change it in `.env`, then `./dc up -d`. Changing `PAYLOAD_SECRET` logs everyone out. Changing `POSTGRES_PASSWORD` needs `./dc exec db psql -U daarul -c "ALTER USER daarul PASSWORD '<new>'"` first.

**Upgrading the Postgres major version** (17 to 18, far in the future) is not automatic. Take a backup, then follow the Postgres upgrade notes; do not just change the image tag.

---

## What to know about the limits

- **One server.** If the VPS dies, the site is down until it is rebuilt. Recovery: new VPS, Parts 1 to 4, then `./restore.sh latest`. Email is separate (Hostinger) and keeps working.
- **The deploy key can control the server** (it can run Docker). It lives only in GitHub secrets and can be revoked by deleting its line from `/home/deploy/.ssh/authorized_keys`.
- **Contact form email** is not connected to a mail server yet. Until the email setup step, messages are written to `./dc logs app` and nobody receives them.
- **Not verified here:** GitHub Actions, GHCR pulls, Let's Encrypt, R2. Their first runs are Parts 4.3, 4.4 and 5.2.
- **No Lighthouse or load test yet.** Run PageSpeed on the live site after Part 6 (requirements section 25).
