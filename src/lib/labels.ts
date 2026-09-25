import type { Program } from '@/payload-types'

export const PROGRAM_STATUS: Record<
  Program['programStatus'],
  { label: string; className: string }
> = {
  active: { label: 'Aktif', className: 'chip--solid' },
  seasonal: { label: 'Musiman', className: 'chip--seasonal' },
  completed: { label: 'Selesai', className: 'chip--done' },
}
