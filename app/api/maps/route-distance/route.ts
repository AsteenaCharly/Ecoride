import { NextResponse } from 'next/server';
import { fetchMapboxRouteDistance } from '@/lib/mapbox';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fromLon = searchParams.get('fromLon');
    const fromLat = searchParams.get('fromLat');
    const toLon = searchParams.get('toLon');
    const toLat = searchParams.get('toLat');

    if (!fromLon || !fromLat || !toLon || !toLat) {
        return NextResponse.json({ success: false, error: 'Coordinates missing' }, { status: 400 });
    }

    try {
        const data = await fetchMapboxRouteDistance(fromLon, fromLat, toLon, toLat);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch directions' }, { status: 500 });
    }
}
