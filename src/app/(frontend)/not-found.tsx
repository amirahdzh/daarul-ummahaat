import Link from 'next/link'

export const metadata = { title: 'Halaman tidak ditemukan', robots: { index: false } }

export default function NotFound() {
  return (
    <div className="container center-page">
      <p className="eyebrow">Kesalahan 404</p>
      <h1 className="title-xl">Halaman tidak ditemukan</h1>
      <p className="lead">Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.</p>
      <div className="actions" style={{ justifyContent: 'center' }}>
        <Link href="/" className="btn btn--primary btn--lg">
          Kembali ke beranda
        </Link>
        <Link href="/programs" className="btn btn--outline btn--lg">
          Lihat program
        </Link>
      </div>
    </div>
  )
}
