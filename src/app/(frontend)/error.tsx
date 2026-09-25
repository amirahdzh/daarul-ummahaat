'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container center-page">
      <p className="eyebrow">Terjadi kesalahan</p>
      <h1 className="title-xl">Maaf, halaman ini belum bisa dibuka</h1>
      <p className="lead">Silakan coba lagi. Jika masalah berlanjut, hubungi kami.</p>
      <button type="button" className="btn btn--primary btn--lg" onClick={reset}>
        Coba lagi
      </button>
    </div>
  )
}
