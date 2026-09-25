import { ProgramCard } from '@/components/Cards'
import { FilterChips } from '@/components/FilterChips'
import { PageHead } from '@/components/PageHead'
import { Pagination } from '@/components/Pagination'
import { getProgramCategories, listPrograms } from '@/lib/data'
import { parsePage } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

type SearchParams = Promise<{ category?: string; page?: string }>

export const generateMetadata = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { category } = await searchParams
  return pageMetadata({
    title: 'Program',
    description:
      'Program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat yang dijalankan yayasan.',
    // Filtered views point back to the main list so search engines index one address.
    path: '/programs',
    seo: category ? { noIndex: true } : undefined,
  })
}

export default async function ProgramsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const category = typeof query.category === 'string' ? query.category : undefined
  const page = parsePage(query.page)
  const [categories, result] = await Promise.all([
    getProgramCategories(),
    listPrograms({ categorySlug: category, page }),
  ])

  return (
    <>
      <PageHead
        title="Program"
        eyebrow="Program kami"
        lead="Program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat yang dijalankan yayasan."
        crumbs={[{ label: 'Program' }]}
      />
      <section className="section" aria-label="Daftar program">
        <div className="container stack" style={{ '--stack': '32px' } as React.CSSProperties}>
          {categories.length > 0 && (
            <FilterChips
              label="Filter kategori program"
              base="/programs"
              param="category"
              active={category}
              items={categories.map((c) => ({ label: c.name, value: c.slug }))}
            />
          )}
          {result.docs.length > 0 ? (
            <ul className="grid grid--cards">
              {result.docs.map((program) => (
                <li key={program.id}>
                  <ProgramCard program={program} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Belum ada program yang ditampilkan.</p>
          )}
          <Pagination
            base="/programs"
            page={result.page}
            totalPages={result.totalPages}
            params={{ category }}
          />
        </div>
      </section>
    </>
  )
}
