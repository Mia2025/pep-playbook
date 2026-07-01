import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { supabaseServer } from '../../lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const html = readFileSync(join(process.cwd(), 'content', 'reader.html'), 'utf8');
  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
