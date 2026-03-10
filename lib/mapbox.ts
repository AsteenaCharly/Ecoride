export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || 'pk.mocktoken';

export async function fetchMapboxAutocomplete(query: string) {
    if (MAPBOX_ACCESS_TOKEN === 'pk.mocktoken') {
        // Return mock data if no real token is set
        return [
            { name: "Mumbai", fullName: "Mumbai, Maharashtra, India", coordinates: [72.8777, 19.0760] },
            { name: "Pune", fullName: "Pune, Maharashtra, India", coordinates: [73.8567, 18.5204] },
            { name: "Delhi", fullName: "New Delhi, Delhi, India", coordinates: [77.2090, 28.6139] },
        ];
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=in&types=place&access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.features) return [];

    return data.features.map((feature: any) => ({
        name: feature.text,
        fullName: feature.place_name,
        coordinates: feature.center // [longitude, latitude]
    }));
}

export async function fetchMapboxRouteDistance(fromLon: string, fromLat: string, toLon: string, toLat: string) {
    if (MAPBOX_ACCESS_TOKEN === 'pk.mocktoken') {
        // Mock driving distance
        return { distanceKm: 150, durationMin: 180 };
    }

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLon},${fromLat};${toLon},${toLat}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
        return { distanceKm: 0, durationMin: 0 };
    }

    const route = data.routes[0];
    const distanceKm = Math.round(route.distance / 1000);
    const durationMin = Math.round(route.duration / 60);

    return { distanceKm, durationMin };
}
