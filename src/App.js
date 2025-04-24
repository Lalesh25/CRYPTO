import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CryptoTable from './components/CryptoTable';
import { selectAssets, updateAsset } from './features/crypto/cryptoSlice';

function compareValues(key, order = 'asc') {
  return function (a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}

function App() {
  const dispatch = useDispatch();
  const assets = useSelector(selectAssets);

  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [gainLossFilter, setGainLossFilter] = useState('all'); // 'all', 'gainers', 'losers'

  useEffect(() => {
    // Map asset symbols to Binance symbols (e.g. BTCUSDT)
    const symbolMap = {
      BTC: 'btcusdt',
      ETH: 'ethusdt',
      BNB: 'bnbusdt',
      ADA: 'adausdt',
    };

    // Create a list of streams for Binance WebSocket
    const streams = Object.values(symbolMap)
      .map(s => `${s}@ticker`)
      .join('/');

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message && message.data && message.stream) {
        const data = message.data;
        // Find asset id by matching symbol
        const assetId = Object.entries(symbolMap).find(([key, val]) => val === data.s.toLowerCase());
        if (!assetId) return;
        const id = assetId[0].toLowerCase();

        // Dispatch updateAsset with real data
        dispatch(updateAsset({
          id,
          price: parseFloat(data.c),
          percent_1h: 0, // Binance does not provide 1h percent in this stream
          percent_24h: parseFloat(data.P), // price change percent in 24h
          percent_7d: 0, // no 7d data
          volume_24h: parseFloat(data.v),
        }));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);

  const filteredAndSortedAssets = useMemo(() => {
    let filteredAssets = assets;

    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerFilter) ||
          asset.symbol.toLowerCase().includes(lowerFilter)
      );
    }

    if (gainLossFilter === 'gainers') {
      filteredAssets = filteredAssets.filter(asset => asset.percent_24h > 0);
      filteredAssets = filteredAssets.sort((a, b) => b.percent_24h - a.percent_24h);
    } else if (gainLossFilter === 'losers') {
      filteredAssets = filteredAssets.filter(asset => asset.percent_24h < 0);
      filteredAssets = filteredAssets.sort((a, b) => a.percent_24h - b.percent_24h);
    } else if (sortConfig !== null) {
      filteredAssets = [...filteredAssets].sort(compareValues(sortConfig.key, sortConfig.direction));
    }

    return filteredAssets;
  }, [assets, filterText, sortConfig, gainLossFilter]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSortChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleGainLossFilterChange = (e) => {
    setGainLossFilter(e.target.value);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Real-Time Crypto Price Tracker
      </h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by name or symbol"
          value={filterText}
          onChange={handleFilterChange}
          style={{ padding: '0.5rem', width: '100%', maxWidth: '300px', fontSize: '1rem' }}
        />
        <select
          value={gainLossFilter}
          onChange={handleGainLossFilterChange}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="all">All</option>
          <option value="gainers">Top Gainers</option>
          <option value="losers">Top Losers</option>
        </select>
      </div>
      <CryptoTable assets={filteredAndSortedAssets} onSort={handleSortChange} sortConfig={sortConfig} />
    </div>
  );
}

export default App;
