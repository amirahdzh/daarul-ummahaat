'use client'

import { useState } from 'react'

export function CopyButton({ value, label = 'Salin nomor' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the number is still visible for manual copy.
    }
  }
  return (
    <>
      <button type="button" className="btn btn--outline" onClick={copy} style={{ minHeight: 48 }}>
        {copied ? 'Tersalin' : label}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Nomor tersalin ke papan klip' : ''}
      </span>
    </>
  )
}
