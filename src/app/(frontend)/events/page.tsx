import { EventCard } from '@/components/Cards'
import { FilterChips } from '@/components/FilterChips'
import { PageHead } from '@/components/PageHead'
import { Pagination } from '@/components/Pagination'
import { getEventCategories, listEvents } from '@/lib/data'
import { parsePage } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

type SearchParams = Promise<{ category?: string; sort?: string; page?: string }>

export const generateMetadata = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { category, sort } = await searchParams
  return pageMetadata({
    title: 'Acara',
    description: 'Kajian, pelatihan, santunan, dan kegiatan lain yang diselenggarakan yayasan.',
    path: '/events',
    seo: category || sort ? { noIndex: true } : undefined,
  })
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const category = typeof query.category === 'string' ? query.category : undefined
  const sort = query.sort === 'oldest' ? 'oldest' : undefined
  const page = parsePage(query.page)
  const [categories, result] = await Promise.all([
    getEventCategories(),
    listEvents({ categorySlug: category, oldestFirst: sort === 'oldest', page }),
  ])

  return (
    <>
      <PageHead
        title="Acara"
        eyebrow="Agenda dan kegiatan"
        lead="Kajian, pelatihan, santunan, dan kegiatan lain yang diselenggarakan yayasan."
        crumbs={[{ label: 'Acara' }]}
      />
      <section className="section" aria-label="Daftar acara">
        <div className="container stack" style={{ '--stack': '32px' } as React.CSSProperties}>
          <div
            className="actions"
            style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            {categories.length > 0 && (
              <FilterChips
                label="Filter kategori acara"
                base="/events"
                param="category"
                active={category}
                extra={{ sort }}
                items={categories.map((c) => ({ label: c.name, value: c.slug }))}
              />
            )}
            <FilterChips
              label="Urutan tanggal"
              base="/events"
              param="sort"
              active={sort}
              allLabel="Terbaru"
              extra={{ category }}
              items={[{ label: 'Terlama', value: 'oldest' }]}
            />
          </div>
          {result.docs.length > 0 ? (
            <ul className="grid grid--cards">
              {result.docs.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Belum ada acara yang ditampilkan.</p>
          )}
          <Pagination
            base="/events"
            page={result.page}
            totalPages={result.totalPages}
            params={{ category, sort }}
          />
        </div>
      </section>
    </>
  )
}
