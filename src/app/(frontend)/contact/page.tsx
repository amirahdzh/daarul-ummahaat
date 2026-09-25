import { ContactForm } from '@/components/ContactForm'
import { PageHead } from '@/components/PageHead'
import { getContactInfo } from '@/lib/data'
import { telHref, whatsappUrl } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Kontak',
    description:
      'Hubungi Yayasan Daarul Ummahaat: alamat, telepon, WhatsApp, email, dan formulir pesan.',
    path: '/contact',
  })

export default async function ContactPage() {
  const info = await getContactInfo()
  const hasInfo = Boolean(info.address || info.phone || info.whatsapp || info.email)

  return (
    <>
      <PageHead
        title="Kontak"
        eyebrow="Hubungi kami"
        lead="Ada pertanyaan atau ingin bergabung? Kirim pesan kepada kami."
        crumbs={[{ label: 'Kontak' }]}
      />

      <section className="section" aria-label="Informasi kontak dan formulir">
        <div className="container split">
          <div className="stack" style={{ '--stack': '24px' } as React.CSSProperties}>
            <div className="info-card">
              <h2>Informasi kontak</h2>
              {hasInfo ? (
                <dl className="dl">
                  {info.address && (
                    <div>
                      <dt>Alamat</dt>
                      <dd style={{ whiteSpace: 'pre-line' }}>{info.address}</dd>
                    </div>
                  )}
                  {info.phone && (
                    <div>
                      <dt>Telepon</dt>
                      <dd>
                        <a href={telHref(info.phone)}>{info.phone}</a>
                      </dd>
                    </div>
                  )}
                  {info.whatsapp && (
                    <div>
                      <dt>WhatsApp</dt>
                      <dd>
                        <a
                          href={whatsappUrl(info.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Kirim pesan WhatsApp
                        </a>
                      </dd>
                    </div>
                  )}
                  {info.email && (
                    <div>
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${info.email}`}>{info.email}</a>
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="muted">
                  Informasi kontak sedang disiapkan. Silakan gunakan formulir di samping.
                </p>
              )}
            </div>

            {info.mapsEmbedUrl && (
              <iframe
                className="map"
                title="Lokasi yayasan di Google Maps"
                src={info.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            )}
            {info.mapsUrl && (
              <p>
                <a
                  href={info.mapsUrl}
                  className="link-arrow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka di Google Maps
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="title-lg" style={{ marginBottom: 20 }}>
              Kirim pesan
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
