import { NextResponse } from 'next/server';
import { fetchMapboxAutocomplete } from '@/lib/mapbox';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ success: false, error: 'Query parameter q is required' }, { status: 400 });
    }

    try {
        const suggestions = await fetchMapboxAutocomplete(query);
        return NextResponse.json({ success: true, data: { suggestions } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch autocomplete' }, { status: 500 });
    }
}
