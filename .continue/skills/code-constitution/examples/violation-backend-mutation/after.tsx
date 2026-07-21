// ✅ CORRECT: Backend as source of truth
// Follows Law 1 (Truth Ownership)

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function CoinPriceCard({ coinId }) {
    // ✅ Frontend only consumes backend data
    const { data } = useQuery({
        queryKey: ['coin', coinId, 'price'],
        queryFn: () => api.getCoinPrice(coinId),
        refetchInterval: 5000, // Backend controls refresh rate
    });

    // ✅ NO local state for truth
    // ✅ NO direct external API calls
    // ✅ NO frontend calculations
    // ✅ NO localStorage for financial data

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            {/* ✅ Display backend-provided data only */}
            <p>Price: ${data.currentPrice}</p>
            <p>24h Avg: ${data.avg24h}</p>

            {/* Backend metadata */}
            <p className="text-xs text-gray-500">
                Updated: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
        </div>
    );
}

// ✅ Backend API implementation (separate service)
// /api/coins/[coinId]/price.js
export async function GET(req, { params }) {
    // ✅ Backend owns the truth
    const price = await db.coinPrices.findFirst({
        where: { coinId: params.coinId },
        orderBy: { timestamp: 'desc' },
    });

    // ✅ Backend calculates aggregates
    const avg24h = await db.coinPrices.aggregate({
        where: {
            coinId: params.coinId,
            timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        _avg: { price: true },
    });

    return Response.json({
        currentPrice: price.price,
        avg24h: avg24h._avg.price,
        timestamp: price.timestamp,
    });
}
