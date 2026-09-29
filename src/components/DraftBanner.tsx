/** Shown above the header, site-wide, while Next.js draft mode is on (a draft's "Preview" button). */
export function DraftBanner() {
  return (
    <div className="draft-banner" role="status">
      <span>
        Anda melihat draf yang belum dipublikasikan. Tampilan ini tidak terlihat oleh pengunjung
        lain.
      </span>
      <a href="/exit-preview">Keluar dari mode pratinjau</a>
    </div>
  )
}
