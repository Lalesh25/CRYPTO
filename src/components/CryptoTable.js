import React from 'react';
import './CryptoTable.css';
import SmallLineChart from './SmallLineChart';

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
}

function PercentChange({ value }) {
  const color = value > 0 ? 'green' : value < 0 ? 'red' : 'black';
  return <span style={{ color }}>{value.toFixed(2)}%</span>;
}

function SortableHeader({ children, sortKey, sortConfig, onSort }) {
  const isActive = sortConfig.key === sortKey;
  const direction = isActive ? sortConfig.direction : null;

  const handleClick = () => {
    onSort(sortKey);
  };

  return (
    <th onClick={handleClick} className="sortable-header">
      {children}
      {isActive ? (direction === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  );
}

const CryptoTable = ({ assets, onSort, sortConfig }) => {
  return (
    <div className="table-container">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Logo</th>
            <SortableHeader sortKey="name" sortConfig={sortConfig} onSort={onSort}>Name</SortableHeader>
            <SortableHeader sortKey="symbol" sortConfig={sortConfig} onSort={onSort}>Symbol</SortableHeader>
            <SortableHeader sortKey="price" sortConfig={sortConfig} onSort={onSort}>Price</SortableHeader>
            <SortableHeader sortKey="percent_1h" sortConfig={sortConfig} onSort={onSort}>1h %</SortableHeader>
            <SortableHeader sortKey="percent_24h" sortConfig={sortConfig} onSort={onSort}>24h %</SortableHeader>
            <SortableHeader sortKey="percent_7d" sortConfig={sortConfig} onSort={onSort}>7d %</SortableHeader>
            <SortableHeader sortKey="market_cap" sortConfig={sortConfig} onSort={onSort}>Market Cap</SortableHeader>
            <SortableHeader sortKey="volume_24h" sortConfig={sortConfig} onSort={onSort}>24h Volume</SortableHeader>
            <SortableHeader sortKey="circulating_supply" sortConfig={sortConfig} onSort={onSort}>Circulating Supply</SortableHeader>
            <SortableHeader sortKey="max_supply" sortConfig={sortConfig} onSort={onSort}>Max Supply</SortableHeader>
            <th>7D Chart</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={asset.id}>
              <td>{index + 1}</td>
              <td>
                <img src={asset.logo} alt={asset.name} className="logo" />
              </td>
              <td>{asset.name}</td>
              <td>{asset.symbol}</td>
              <td>${asset.price.toLocaleString()}</td>
              <td><PercentChange value={asset.percent_1h} /></td>
              <td><PercentChange value={asset.percent_24h} /></td>
              <td><PercentChange value={asset.percent_7d} /></td>
              <td>${formatNumber(asset.market_cap)}</td>
              <td>${formatNumber(asset.volume_24h)}</td>
              <td>{formatNumber(asset.circulating_supply)}</td>
              <td>{asset.max_supply ? formatNumber(asset.max_supply) : '-'}</td>
              <td>
                <SmallLineChart />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
