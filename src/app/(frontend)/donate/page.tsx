import Link from 'next/link'

import { CopyButton } from '@/components/CopyButton'
import { PageHead } from '@/components/PageHead'
import { Photo } from '@/components/Photo'
import { hasRichText, RichText } from '@/components/RichText'
import { getDonationInfo } from '@/lib/data'
import { whatsappUrl } from '@/lib/format'
import { asDoc } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Donasi',
    description:
      'Cara berdonasi untuk mendukung program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat.',
    path: '/donate',
  })

export default async function DonatePage() {
  const info = await getDonationInfo()
  const banks = info.bankAccounts ?? []
  const wallets = info.ewallets ?? []
  const qris = asDoc(info.qris?.image)
  const confirmation = info.whatsappConfirmation
  const hasMethods = banks.length > 0 || wallets.length > 0 || Boolean(qris)

  return (
    <>
      <PageHead
        title="Donasi"
        eyebrow="Mari berbagi"
        lead="Dukung misi kami dalam membina, mendidik, dan memberdayakan masyarakat."
        crumbs={[{ label: 'Donasi' }]}
      />

      {hasRichText(info.introduction) && (
        <section className="section" aria-labelledby="donasi-pengantar">
          <div className="container">
            <h2 id="donasi-pengantar" className="visually-hidden">
              Tentang donasi
            </h2>
            <RichText data={info.introduction} />
          </div>
        </section>
      )}

      <section className="section section--mist" aria-labelledby="donasi-metode">
        <div className="container stack" style={{ '--stack': '32px' } as React.CSSProperties}>
          <h2 id="donasi-metode" className="title-lg">
            Cara berdonasi
          </h2>

          {!hasMethods && (
            <p className="empty">
              Informasi rekening donasi sedang disiapkan. Silakan{' '}
              <Link href="/contact">hubungi kami</Link> untuk berdonasi.
            </p>
          )}

          {hasMethods && (
            <ul className="pay-grid" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {banks.map((bank, index) => {
                const qr = asDoc(bank.qrImage)
                return (
                  <li key={bank.id ?? `bank-${index}`} className="pay-card">
                    <span className="chip">Transfer bank</span>
                    <div className="pay-card__row">
                      <div className="pay-card__main">
                        <div className="pay-card__bank">{bank.bankName}</div>
                        <div className="pay-card__number">{bank.accountNumber}</div>
                        <p className="muted">a.n. {bank.accountHolder}</p>
                      </div>
                      {qr && (
                        <Photo media={qr} prefer="card" sizes="140px" className="pay-card__qr" />
                      )}
                    </div>
                    <div>
                      <CopyButton value={bank.accountNumber} label="Salin nomor rekening" />
                    </div>
                    {bank.additionalInfo && <p className="card__text">{bank.additionalInfo}</p>}
                  </li>
                )
              })}

              {qris && (
                <li className="pay-card">
                  <span className="chip">QRIS</span>
                  <Photo
                    media={qris}
                    prefer="card"
                    sizes="(min-width: 720px) 260px, 70vw"
                    className="pay-card__qr pay-card__qr--big"
                  />
                  {info.qris?.additionalInfo && (
                    <p className="card__text">{info.qris.additionalInfo}</p>
                  )}
                </li>
              )}

              {wallets.map((wallet, index) => {
                const qr = asDoc(wallet.qrImage)
                return (
                  <li key={wallet.id ?? `wallet-${index}`} className="pay-card">
                    <span className="chip">E-wallet</span>
                    <div className="pay-card__row">
                      <div className="pay-card__main">
                        <div className="pay-card__bank">{wallet.provider}</div>
                        <div className="pay-card__number">{wallet.accountNumber}</div>
                        {wallet.accountHolder && (
                          <p className="muted">a.n. {wallet.accountHolder}</p>
                        )}
                      </div>
                      {qr && (
                        <Photo media={qr} prefer="card" sizes="140px" className="pay-card__qr" />
                      )}
                    </div>
                    <div>
                      <CopyButton value={wallet.accountNumber} label="Salin nomor" />
                    </div>
                    {wallet.additionalInfo && <p className="card__text">{wallet.additionalInfo}</p>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {confirmation?.number && (
        <section className="section" aria-labelledby="donasi-konfirmasi">
          <div className="container stack" style={{ '--stack': '16px' } as React.CSSProperties}>
            <h2 id="donasi-konfirmasi" className="title-lg">
              Konfirmasi donasi
            </h2>
            <p className="lead">
              Setelah berdonasi, kirim bukti transfer melalui WhatsApp agar donasi Anda dapat kami
              catat dan sampaikan kepada penerima manfaat.
            </p>
            <p>
              <a
                href={whatsappUrl(confirmation.number, confirmation.message)}
                className="btn btn--primary btn--lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Konfirmasi Donasi via WhatsApp
              </a>
            </p>
          </div>
        </section>
      )}
    </>
  )
}
