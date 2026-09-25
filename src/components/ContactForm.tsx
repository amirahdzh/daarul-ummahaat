'use client'

import { useActionState, useState } from 'react'

import { sendContactMessage, type ContactState } from '@/app/(frontend)/contact/actions'

const initial: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial)
  // Captured once when the form appears; a submission that arrives within seconds is a bot.
  const [startedAt] = useState(() => String(Date.now()))
  const errors = state.errors ?? {}
  const values = state.values

  if (state.status === 'success') {
    return (
      <div className="form" role="status">
        <p className="notice notice--success">{state.message}</p>
      </div>
    )
  }

  return (
    <form className="form" action={action} noValidate>
      {state.status === 'error' && state.message && (
        <p className="notice notice--error" role="alert">
          {state.message}
        </p>
      )}

      <div className="form__row form__row--2">
        <div className="field">
          <label htmlFor="contact-name">Nama</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="field__error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-whatsapp">Nomor WhatsApp (opsional)</label>
          <input
            id="contact-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={values?.whatsapp}
            aria-invalid={errors.whatsapp ? true : undefined}
            aria-describedby={errors.whatsapp ? 'contact-whatsapp-error' : undefined}
          />
          {errors.whatsapp && (
            <p id="contact-whatsapp-error" className="field__error">
              {errors.whatsapp}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values?.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="field__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-message">Pesan</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="field__error">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div>
        <button type="submit" className="btn btn--primary btn--lg" disabled={pending}>
          {pending ? 'Mengirim…' : 'Kirim Pesan'}
        </button>
      </div>
    </form>
  )
}
