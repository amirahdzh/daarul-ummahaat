import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GalleryGrid } from '@/components/GalleryGrid'
import { PageHead } from '@/components/PageHead'
import { Photo } from '@/components/Photo'
import { hasRichText, RichText } from '@/components/RichText'
import { getProgramBySlug } from '@/lib/data'
import { toGalleryItems } from '@/lib/gallery'
import { PROGRAM_STATUS } from '@/lib/labels'
import { asDoc } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import type { GalleryImage, ProgramCategory } from '@/payload-types'

type Params = Promise<{ slug: string }>

export const generateMetadata = async ({ params }: { params: Params }) => {
  const program = await getProgramBySlug((await params).slug)
  if (!program) return {}
  return pageMetadata({
    title: program.name,
    description: program.shortDescription,
    path: `/programs/${program.slug}`,
    seo: program.seo,
    image: program.featuredImage,
  })
}

export default async function ProgramPage({ params }: { params: Params }) {
  const program = await getProgramBySlug((await params).slug)
  if (!program) notFound()

  const category = asDoc<ProgramCategory>(program.category)
  const image = asDoc(program.featuredImage)
  const status = PROGRAM_STATUS[program.programStatus]
  const photos = (program.gallery?.docs ?? []).filter(
    (doc): doc is GalleryImage => typeof doc === 'object',
  )
  const facts = [
    { label: 'Kategori', value: category?.name },
    { label: 'Sasaran penerima manfaat', value: program.targetBeneficiaries },
    { label: 'Lokasi', value: program.location },
  ].filter((fact) => fact.value)

  return (
    <>
      <PageHead
        title={program.name}
        eyebrow={category?.name}
        lead={program.shortDescription}
        crumbs={[{ label: 'Program', href: '/programs' }, { label: program.name }]}
      />

      <section className="section" aria-label="Detail program">
        <div className="container stack" style={{ '--stack': '40px' } as React.CSSProperties}>
          {image && (
            <div className="media media--hero" style={{ aspectRatio: '21 / 9' }}>
              <Photo
                media={image}
                prefer="large"
                sizes="(min-width: 1440px) 1280px, 100vw"
                priority
              />
            </div>
          )}

          <div className="detail">
            <div className="stack" style={{ '--stack': '32px' } as React.CSSProperties}>
              {hasRichText(program.objectives) && (
                <div>
                  <h2 className="title-lg" style={{ marginBottom: 16 }}>
                    Tujuan program
                  </h2>
                  <RichText data={program.objectives} />
                </div>
              )}
              {hasRichText(program.activities) && (
                <div>
                  <h2 className="title-lg" style={{ marginBottom: 16 }}>
                    Kegiatan program
                  </h2>
                  <RichText data={program.activities} />
                </div>
              )}
              {!hasRichText(program.objectives) && !hasRichText(program.activities) && (
                <p className="muted">Keterangan lengkap program ini akan segera ditambahkan.</p>
              )}
            </div>

            <aside
              className="stack"
              style={{ '--stack': '16px' } as React.CSSProperties}
              aria-label="Informasi program"
            >
              <div className="info-card">
                <h2>Informasi</h2>
                <span className={`chip ${status.className}`} style={{ alignSelf: 'flex-start' }}>
                  {status.label}
                </span>
                <dl className="dl">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                  {program.schedule && (
                    <div>
                      <dt>Jadwal</dt>
                      <dd style={{ whiteSpace: 'pre-line' }}>{program.schedule}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="actions" style={{ flexDirection: 'column' }}>
                {program.showDonationCta && (
                  <Link href="/donate" className="btn btn--donate btn--lg">
                    Donasi
                  </Link>
                )}
                {program.registrationLink && (
                  <a
                    href={program.registrationLink}
                    className="btn btn--primary btn--lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Daftar
                  </a>
                )}
                <Link href="/contact" className="btn btn--outline btn--lg">
                  Hubungi Kami
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section section--mist" aria-labelledby="galeri-program">
          <div className="container">
            <h2 id="galeri-program" className="title-lg" style={{ marginBottom: 32 }}>
              Galeri program
            </h2>
            <GalleryGrid items={toGalleryItems(photos)} />
          </div>
        </section>
      )}
    </>
  )
}
