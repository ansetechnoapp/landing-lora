import { submitLead } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return new URL(origin).origin === new URL(request.url).origin;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.formData || typeof body.formData !== 'object') {
    return NextResponse.json({ error: 'formData is required' }, { status: 400 });
  }

  try {
    const { slug } = await params;
    const result = await submitLead(slug, body.formData);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Lead submission unavailable' }, { status: 502 });
  }
}
