import { FilterChips } from '@/components/FilterChips'
import { GalleryGrid } from '@/components/GalleryGrid'
import { PageHead } from '@/components/PageHead'
import { Pagination } from '@/components/Pagination'
import { getGalleryCategories, listGallery } from '@/lib/data'
import { parsePage } from '@/lib/format'
import { toGalleryItems } from '@/lib/gallery'
import { pageMetadata } from '@/lib/seo'

type SearchParams = Promise<{ category?: string; page?: string }>

export const generateMetadata = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { category } = await searchParams
  return pageMetadata({
    title: 'Galeri',
    description: 'Dokumentasi kegiatan dan program yayasan.',
    path: '/gallery',
    seo: category ? { noIndex: true } : undefined,
  })
}

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const category = typeof query.category === 'string' ? query.category : undefined
  const page = parsePage(query.page)
  const [categories, result] = await Promise.all([
    getGalleryCategories(),
    listGallery({ categorySlug: category, page }),
  ])

  return (
    <>
      <PageHead
        title="Galeri"
        eyebrow="Dokumentasi"
        lead="Dokumentasi kegiatan dan program yayasan."
        crumbs={[{ label: 'Galeri' }]}
      />
      <section className="section" aria-label="Galeri foto">
        <div className="container stack" style={{ '--stack': '32px' } as React.CSSProperties}>
          {categories.length > 0 && (
            <FilterChips
              label="Filter kategori galeri"
              base="/gallery"
              param="category"
              active={category}
              items={categories.map((c) => ({ label: c.name, value: c.slug }))}
            />
          )}
          {result.docs.length > 0 ? (
            <GalleryGrid items={toGalleryItems(result.docs)} />
          ) : (
            <p className="empty">Belum ada foto yang ditampilkan.</p>
          )}
          <Pagination
            base="/gallery"
            page={result.page}
            totalPages={result.totalPages}
            params={{ category }}
          />
        </div>
      </section>
    </>
  )
}
