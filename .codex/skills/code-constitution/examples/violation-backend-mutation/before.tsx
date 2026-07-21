// ❌ VIOLATION: Frontend mutating backend data
// This violates Law 1 (Truth Ownership)

import { useState, useEffect } from 'react';

export function CoinPriceCard({ coinId }) {
    const [price, setPrice] = useState(0);
    const [history, setHistory] = useState([]);

    // VIOLATION: Frontend making truth decisions
    const updatePrice = (newPrice) => {
        // ❌ Directly mutating price state
        setPrice(newPrice);

        // ❌ CRITICAL VIOLATION: Frontend managing historical data
        setHistory(prev => [...prev, newPrice]);

        // ❌ Frontend calculating aggregates
        const avg = history.reduce((a, b) => a + b, 0) / history.length;

        // ❌ Frontend persisting to localStorage
        localStorage.setItem(`coin_${coinId}_price`, newPrice.toString());
        localStorage.setItem(`coin_${coinId}_history`, JSON.stringify(history));
    };

    // ❌ Frontend calling external API directly
    useEffect(() => {
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then(res => res.json())
            .then(data => {
                // ❌ Frontend processing raw external data
                updatePrice(data.market_data.current_price.usd);
            });
    }, [coinId]);

    return (
        <div>
            <p>Price: ${price}</p>
            <p>24h Avg: ${avg}</p>
        </div>
    );
}
