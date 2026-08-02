import { NextResponse } from 'next/server';

/* All site forms (the static pages in public/ and anything in the app) post
   here. This route is the only thing that talks to Supabase, so the key
   stays server-side. Tables are INSERT-only under RLS regardless — see
   supabase/schema.sql. */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function insert(table: string, row: Record<string, unknown>, prefer = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: `return=minimal${prefer}`,
    },
    body: JSON.stringify(row),
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json(
      { ok: false, error: 'The server is not configured yet. Please try again later.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== 'object') throw new Error('bad body');
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot filled in → a bot. Pretend everything went fine.
  if (clean(body.website, 10)) return NextResponse.json({ ok: true });

  const kind = clean(body.kind, 40);
  const page = clean(body.page, 200);

  try {
    if (kind === 'newsletter') {
      const email = clean(body.email, 200).toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json(
          { ok: false, error: 'Please enter a valid email address.' },
          { status: 400 },
        );
      }
      await insert(
        'newsletter_subscribers?on_conflict=email',
        { email, page },
        ',resolution=ignore-duplicates',
      );
      return NextResponse.json({ ok: true });
    }

    if (kind === 'giving') {
      const p = (body.payload ?? {}) as Record<string, unknown>;
      const items = Array.isArray(p.items) ? p.items.slice(0, 30) : [];
      await insert('giving_intents', {
        page: page || '/give',
        currency: clean(p.currency, 10),
        frequency: clean(p.frequency, 30),
        total_usd: Number(p.total_usd) || 0,
        items,
      });
      return NextResponse.json({ ok: true });
    }

    // Generic form submission.
    const payload = (body.payload ?? {}) as Record<string, unknown>;
    if (JSON.stringify(payload).length > 20000) {
      return NextResponse.json({ ok: false, error: 'Submission too large.' }, { status: 413 });
    }
    const email = clean(body.email, 200);
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }
    await insert('submissions', {
      page,
      form_name: clean(body.form, 150),
      name: clean(body.name, 200),
      email,
      payload,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/submit]', err);
    return NextResponse.json(
      { ok: false, error: 'We could not save your submission. Please try again shortly.' },
      { status: 502 },
    );
  }
}
