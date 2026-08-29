import React from 'react';

const SearchFilterBar = ({ placeholder, onSearch, onFilterChange, filterOptions }) => {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      {filterOptions && (
        <select onChange={(e) => onFilterChange(e.target.value)} className="filter-select">
          <option value="">All Categories</option>
          {filterOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchFilterBar;
