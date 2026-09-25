FROM alpine:3.21
# restic: encrypted, deduplicated backups. postgresql17-client: pg_dump matching the server version.
RUN apk add --no-cache restic postgresql17-client curl tzdata
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh
ENTRYPOINT ["/usr/local/bin/backup.sh"]
