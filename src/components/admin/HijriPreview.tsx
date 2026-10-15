'use client'

import { useFormFields, useTranslation } from '@payloadcms/ui'

import { formatHijriDate } from '../../lib/format'

/**
 * Shows today's Hijri date with the correction currently typed in the field above it, so an
 * admin can compare it with the government announcement and adjust until the two match,
 * without having to know what "correction in days" means.
 */
export function HijriPreview() {
  const { i18n } = useTranslation()
  const raw = useFormFields(([fields]) => fields.hijriDayAdjustment?.value)
  const adjustment = Number.isFinite(Number(raw)) ? Number(raw) : 0
  const today = formatHijriDate(new Date(), adjustment)
  const text =
    i18n.language === 'en'
      ? {
          label: "Today's Hijri date on the website:",
          hint: 'If this differs from the announcement, change the number above.',
        }
      : {
          label: 'Tanggal Hijriah hari ini di website:',
          hint: 'Jika berbeda dengan pengumuman, ubah angka di atas.',
        }
  return (
    <div className="hijri-preview" role="status">
      <span>{text.label} </span>
      <strong>{today}</strong>
      <p>{text.hint}</p>
    </div>
  )
}
