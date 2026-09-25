import { hasRichText, RichText } from '@/components/RichText'
import { PageHead } from '@/components/PageHead'
import { Photo } from '@/components/Photo'
import { getFoundationProfile, getLegalDocuments } from '@/lib/data'
import { formatShortDate } from '@/lib/format'
import { asDoc } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'

export const generateMetadata = async () => {
  const profile = await getFoundationProfile()
  return pageMetadata({
    title: 'Tentang Kami',
    description: profile.vision,
    path: '/about',
    seo: profile.seo,
  })
}

export default async function AboutPage() {
  const [profile, documents] = await Promise.all([getFoundationProfile(), getLegalDocuments()])
  const structureChart = asDoc(profile.organizationStructure?.chart)
  const photos = (profile.organizationPhotos ?? []).flatMap((item) => {
    const image = asDoc(item.image)
    return image ? [{ id: item.id ?? String(image.id), image, caption: item.caption }] : []
  })
  const values = profile.coreValues ?? []
  const anyContent =
    hasRichText(profile.profile) ||
    hasRichText(profile.history) ||
    Boolean(profile.vision) ||
    hasRichText(profile.mission) ||
    values.length > 0 ||
    hasRichText(profile.organizationStructure?.description) ||
    Boolean(structureChart) ||
    photos.length > 0 ||
    documents.length > 0

  return (
    <>
      <PageHead title="Tentang Kami" eyebrow="Profil yayasan" crumbs={[{ label: 'Tentang' }]} />

      {!anyContent && (
        <div className="section">
          <div className="container">
            <p className="empty">Informasi tentang yayasan sedang disiapkan.</p>
          </div>
        </div>
      )}

      {(hasRichText(profile.profile) || hasRichText(profile.history)) && (
        <section className="section" aria-labelledby="profil">
          <div className="container split">
            <h2 id="profil" className="title-lg">
              Profil dan sejarah
            </h2>
            <div className="stack" style={{ '--stack': '32px' } as React.CSSProperties}>
              <RichText data={profile.profile} />
              {hasRichText(profile.history) && (
                <div>
                  <h3 className="title-md" style={{ marginBottom: 12 }}>
                    Sejarah berdirinya yayasan
                  </h3>
                  <RichText data={profile.history} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(profile.vision || hasRichText(profile.mission)) && (
        <section className="section section--mist" aria-labelledby="visi-misi">
          <div className="container split">
            <h2 id="visi-misi" className="title-lg">
              Visi dan misi
            </h2>
            <div className="stack" style={{ '--stack': '32px' } as React.CSSProperties}>
              {profile.vision && (
                <div>
                  <h3 className="title-md" style={{ marginBottom: 12 }}>
                    Visi
                  </h3>
                  <p className="lead" style={{ whiteSpace: 'pre-line', color: 'var(--ink)' }}>
                    {profile.vision}
                  </p>
                </div>
              )}
              {hasRichText(profile.mission) && (
                <div>
                  <h3 className="title-md" style={{ marginBottom: 12 }}>
                    Misi
                  </h3>
                  <RichText data={profile.mission} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="section" aria-labelledby="nilai">
          <div className="container">
            <h2 id="nilai" className="title-lg" style={{ marginBottom: 32 }}>
              Nilai-nilai yayasan
            </h2>
            <ul className="grid grid--cards">
              {values.map((value, index) => (
                <li key={value.id ?? index} className="pillar">
                  <span className="pillar__no" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="title-md">{value.title}</h3>
                  {value.description && <p className="card__text">{value.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(hasRichText(profile.organizationStructure?.description) ||
        structureChart ||
        photos.length > 0) && (
        <section className="section section--mist" aria-labelledby="struktur">
          <div className="container stack" style={{ '--stack': '32px' } as React.CSSProperties}>
            <h2 id="struktur" className="title-lg">
              Struktur organisasi
            </h2>
            <RichText data={profile.organizationStructure?.description} />
            {structureChart && (
              <figure style={{ margin: 0 }}>
                <Photo
                  media={structureChart}
                  prefer="large"
                  sizes="(min-width: 1040px) 900px, 100vw"
                />
              </figure>
            )}
            {photos.length > 0 && (
              <ul className="grid grid--cards">
                {photos.map((photo) => (
                  <li key={photo.id}>
                    <figure style={{ margin: 0 }}>
                      <div
                        className="media media--16x9"
                        style={{ borderRadius: 'var(--radius-card)' }}
                      >
                        <Photo media={photo.image} />
                      </div>
                      {photo.caption && (
                        <figcaption className="gallery__caption">{photo.caption}</figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="section" aria-labelledby="legalitas">
          <div className="container">
            <h2 id="legalitas" className="title-lg" style={{ marginBottom: 32 }}>
              Dokumen legalitas
            </h2>
            <ul className="grid grid--cards">
              {documents.map((doc) => (
                <li key={doc.id} className="info-card">
                  <div className="actions" style={{ gap: 8 }}>
                    {doc.year && <span className="chip">{doc.year}</span>}
                    {doc.mimeType === 'application/pdf' && (
                      <span className="chip chip--done">PDF</span>
                    )}
                  </div>
                  <h3 className="title-md">{doc.name}</h3>
                  {doc.description && <p className="card__text">{doc.description}</p>}
                  {doc.url && (
                    <a
                      href={doc.url}
                      className="link-arrow"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: 'auto' }}
                    >
                      Lihat dokumen
                      <span className="visually-hidden"> {doc.name}</span>
                    </a>
                  )}
                  <span className="muted" style={{ fontSize: '0.8125rem' }}>
                    Diperbarui {formatShortDate(doc.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
