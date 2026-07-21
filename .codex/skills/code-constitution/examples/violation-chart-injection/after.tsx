// ✅ CORRECT: Realtime and historical data strictly separated
// Follows Law 3 (Realtime Ephemerality) and Law 4 (Chart Truthfulness)

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

export function BitcoinChart() {
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    // ✅ SEPARATE state for realtime display
    const [realtimePrice, setRealtimePrice] = useState(null);
    const [realtimeChange, setRealtimeChange] = useState(0);

    useEffect(() => {
        const chart = createChart(chartRef.current, { width: 600, height: 400 });
        const series = chart.addLineSeries();

        // ✅ Load ONLY historical data into chart
        fetch('/api/bitcoin/historical')
            .then(res => res.json())
            .then(data => {
                series.setData(data); // Immutable historical record

                // ✅ Use last historical point as baseline for realtime change
                const lastPrice = data[data.length - 1].value;
                setRealtimeChange(0); // Reset change against history
            });

        // ✅ WebSocket for DISPLAY ONLY
        const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@trade');

        ws.onmessage = (event) => {
            const tick = JSON.parse(event.data);
            const price = parseFloat(tick.p);

            // ✅ Update ephemeral display state ONLY
            setRealtimePrice(price);

            // ✅ Calculate change from last HISTORICAL close
            const lastHistoricalPrice = series.data()[series.data().length - 1].value;
            setRealtimeChange(((price - lastHistoricalPrice) / lastHistoricalPrice) * 100);

            // ✅ NO modification to chart data
            // ✅ NO persistence
            // ✅ NO mixing historical and realtime
        };

        seriesRef.current = series;

        return () => ws.close();
    }, []);

    return (
        <div>
            {/* ✅ Historical chart (immutable) */}
            <div ref={chartRef} />

            {/* ✅ Separate realtime display */}
            <div className="realtime-ticker bg-gray-900 p-4 mt-2">
                <p className="text-sm text-gray-400">Live Price (not in chart)</p>
                <p className="text-2xl font-bold">
                    ${realtimePrice?.toLocaleString() ?? '---'}
                </p>
                <p className={realtimeChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {realtimeChange >= 0 ? '↑' : '↓'} {Math.abs(realtimeChange).toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Since last close • Ephemeral • Not persisted
                </p>
            </div>
        </div>
    );
}

// ✅ Backend aggregates realtime into historical at fixed intervals
// /api/cron/aggregate-bitcoin-price.js (runs every 5 minutes)
export async function aggregateRealtimeToHistory() {
    // ✅ Collect realtime ticks from last 5 minutes
    const realtimeTicks = await redis.lrange('btc:ticks:last5m', 0, -1);

    // ✅ Calculate OHLCV from ticks
    const candle = calculateOHLCV(realtimeTicks);

    // ✅ APPEND to historical data (immutable)
    await db.bitcoinHistory.create({
        data: {
            timestamp: candle.timestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
        },
    });

    // ✅ Clear realtime buffer
    await redis.del('btc:ticks:last5m');
}
