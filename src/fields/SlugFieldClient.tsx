'use client'

import { TextInput, useField, useFormFields, useTranslation } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import { slugify } from '../lib/slugify'

const STRINGS = {
  en: {
    label: 'Slug',
    description:
      'Part of the page address. Filled in automatically from the name as you type. Edit it if you want a different address — changing it after publishing breaks existing links.',
    resync: 'Fill in again from the name',
  },
  id: {
    label: 'Slug',
    description:
      'Bagian dari alamat halaman. Terisi otomatis dari nama saat Anda mengetik. Ubah jika Anda ingin alamat yang berbeda — mengubahnya setelah dipublikasikan akan merusak tautan yang sudah ada.',
    resync: 'Isi ulang dari nama',
  },
}

const linkButtonStyle: React.CSSProperties = {
  marginTop: 6,
  padding: 0,
  border: 0,
  background: 'none',
  color: 'var(--theme-text-500, #666)',
  fontSize: 12,
  textDecoration: 'underline',
  cursor: 'pointer',
}

/**
 * Fills the slug live as the admin types the Name field, instead of only on save. The server is
 * still the source of truth (fields/slug.ts cleans and defaults it again on save regardless), so
 * this is purely an admin-panel convenience. Editing the slug by hand stops it following Name;
 * the small link below the field brings it back.
 */
export const SlugFieldClient: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const name = useFormFields(([fields]) => fields?.name?.value)
  const {
    i18n: { language },
  } = useTranslation()
  const strings = language === 'en' ? STRINGS.en : STRINGS.id
  // A document that already has a slug (editing an existing one) starts locked, so opening it
  // never silently rewrites a slug someone chose on purpose.
  const [following, setFollowing] = useState(() => !value)

  useEffect(() => {
    if (!following || typeof name !== 'string') return
    setValue(slugify(name))
    // Only Name and the following flag should re-run this; setValue is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, following])

  return (
    <div className="field-type text">
      <TextInput
        path={path}
        label={strings.label}
        description={strings.description}
        value={value ?? ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setFollowing(false)
          setValue(event.target.value)
        }}
        AfterInput={
          following ? undefined : (
            <button type="button" style={linkButtonStyle} onClick={() => setFollowing(true)}>
              {strings.resync}
            </button>
          )
        }
      />
    </div>
  )
}
