'use client';

import { useState } from 'react';

export function LeadForm({ slug }: { slug: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch(`/api/leads/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            name: form.get('name'),
            email: form.get('email'),
            message: form.get('message'),
          },
          source: 'website',
        }),
      });
      setStatus(response.ok ? 'success' : 'error');
      if (response.ok) formElement.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="mt-14 rounded-xl bg-violet-50 p-6">
      <h2 className="text-2xl font-bold">Parlons de votre projet</h2>
      <p className="mt-2 text-gray-600">Laissez vos coordonnées et nous vous répondrons rapidement.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Nom" className="rounded-lg border border-gray-200 bg-white px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-gray-200 bg-white px-3 py-2" />
        <textarea name="message" required placeholder="Votre message" rows={4} className="rounded-lg border border-gray-200 bg-white px-3 py-2 sm:col-span-2" />
        <button type="submit" disabled={status === 'sending'} className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
          {status === 'sending' ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
      {status === 'success' && <p className="mt-4 text-sm text-green-700">Merci, votre demande a bien été envoyée.</p>}
      {status === 'error' && <p className="mt-4 text-sm text-red-700">Envoi impossible pour le moment. Réessayez plus tard.</p>}
    </section>
  );
}
