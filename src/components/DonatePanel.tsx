import Link from 'next/link'

export function DonatePanel({ text }: { text: string }) {
  return (
    <section className="section" aria-labelledby="donate-cta">
      <div className="container">
        <div className="donate-panel motif motif--ink" style={{ overflow: 'hidden' }}>
          <h2 id="donate-cta" className="donate-panel__text">
            {text}
          </h2>
          <Link href="/donate" className="btn btn--deep btn--lg" style={{ flexShrink: 0 }}>
            Donasi
          </Link>
        </div>
      </div>
    </section>
  )
}
