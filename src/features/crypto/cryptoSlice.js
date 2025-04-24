import { createSlice } from '@reduxjs/toolkit';

import bitcoinLogo from '../../assets/logos/bitcoin.png'
import ethereumLogo from '../../assets/logos/ethereum.png';
import tetherLogo from '../../assets/logos/tether.png';
import binancecoinLogo from '../../assets/logos/binancecoin.jpeg';
import cardanoLogo from '../../assets/logos/cardano.png';

const initialState = {
  assets: [
    {
      id: 'bitcoin',
      logo: bitcoinLogo,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 30000,
      percent_1h: 0.5,
      percent_24h: 2.3,
      percent_7d: 5.1,
      market_cap: 600000000000,
      volume_24h: 35000000000,
      circulating_supply: 19000000,
      max_supply: 21000000,
      chart_7d: 'https://www.svgrepo.com/show/354202/line-chart.svg',
    },
    {
      id: 'ethereum',
      logo: ethereumLogo,
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2000,
      percent_1h: -0.3,
      percent_24h: 1.2,
      percent_7d: 3.4,
      market_cap: 250000000000,
      volume_24h: 20000000000,
      circulating_supply: 115000000,
      max_supply: null,
      chart_7d: 'https://www.svgrepo.com/show/354202/line-chart.svg',
    },
    {
      id: 'tether',
      logo: tetherLogo,
      name: 'Tether',
      symbol: 'USDT',
      price: 1,
      percent_1h: 0,
      percent_24h: 0,
      percent_7d: 0,
      market_cap: 62000000000,
      volume_24h: 80000000000,
      circulating_supply: 62000000000,
      max_supply: null,
      chart_7d: 'https://www.svgrepo.com/show/354202/line-chart.svg',
    },
    {
      id: 'binancecoin',
      logo: binancecoinLogo,
      name: 'Binance Coin',
      symbol: 'BNB',
      price: 300,
      percent_1h: 0.1,
      percent_24h: 1.5,
      percent_7d: 4.2,
      market_cap: 45000000000,
      volume_24h: 1500000000,
      circulating_supply: 170000000,
      max_supply: 170000000,
      chart_7d: 'https://www.svgrepo.com/show/354202/line-chart.svg',
    },
    {
      id: 'cardano',
      logo: cardanoLogo,
      name: 'Cardano',
      symbol: 'ADA',
      price: 1.2,
      percent_1h: -0.1,
      percent_24h: 0.5,
      percent_7d: 2.1,
      market_cap: 40000000000,
      volume_24h: 1000000000,
      circulating_supply: 32000000000,
      max_supply: 45000000000,
      chart_7d: 'https://www.svgrepo.com/show/354202/line-chart.svg',
    },
  ],
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateAsset(state, action) {
      const { id, price, percent_1h, percent_24h, percent_7d, volume_24h } = action.payload;
      const asset = state.assets.find((a) => a.id === id);
      if (asset) {
        asset.price = price;
        asset.percent_1h = percent_1h;
        asset.percent_24h = percent_24h;
        asset.percent_7d = percent_7d;
        asset.volume_24h = volume_24h;
      }
    },
  },
});

export const { updateAsset } = cryptoSlice.actions;

export const selectAssets = (state) => state.crypto.assets;

export default cryptoSlice.reducer;
