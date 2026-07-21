// ❌ VIOLATION: Realtime ticks injected into historical chart
// Violates Law 3 (Realtime Ephemerality) and Law 4 (Chart Truthfulness)

import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export function BitcoinChart() {
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(() => {
        const chart = createChart(chartRef.current, { width: 600, height: 400 });
        const series = chart.addLineSeries();

        // ✅ Load historical data (OK)
        fetch('/api/bitcoin/historical')
            .then(res => res.json())
            .then(data => {
                series.setData(data); // Historical data
            });

        // ❌ CRITICAL VIOLATION: WebSocket realtime injection
        const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@trade');

        ws.onmessage = (event) => {
            const tick = JSON.parse(event.data);
            const price = parseFloat(tick.p);
            const time = Math.floor(tick.T / 1000);

            // ❌ VIOLATION: Adding realtime tick to historical chart
            series.update({
                time,
                value: price,
            });

            // ❌ VIOLATION: Persisting realtime as history
            const existingData = series.data();
            const updated = [...existingData, { time, value: price }];

            // ❌ This permanently alters the historical record
            series.setData(updated);
        };

        seriesRef.current = series;

        return () => ws.close();
    }, []);

    return <div ref={chartRef} />;
}

// ❌ Result: Chart now contains MIX of:
// - Historical aggregated data (5m candles from backend)
// - Realtime individual ticks (streaming)
//
// This is FORBIDDEN. Users cannot distinguish history from realtime.
// The chart is now lying about the past.
