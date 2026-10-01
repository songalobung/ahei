import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { universitiesRepository } from '@/domain/repositories';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const sector = searchParams.get('sector') || 'all';
  const country = searchParams.get('country') || 'all';

  try {
    let query = supabase.from('universities').select('*');

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (sector && sector !== 'all') {
      query = query.ilike('sector', sector);
    }
    if (country && country !== 'all') {
      query = query.ilike('country_iso2', country);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return NextResponse.json({
        source: 'supabase_postgres',
        total: data.length,
        institutions: data,
      });
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to local repository:', err);
  }

  // Graceful fallback to static JSON repository
  const universities = universitiesRepository.search(q, sector, country);
  return NextResponse.json({
    source: 'local_repository',
    total: universities.length,
    institutions: universities,
  });
}
