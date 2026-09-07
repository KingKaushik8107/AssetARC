import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, decommissionAsset } from '../../store/slices/assetSlice';
import EmptyState from '../common/EmptyState';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import { INDUSTRIAL_IMAGES } from '../../services/industrialAssets';

import AssetModal from './AssetModal';
import AssetDetailsModal from './AssetDetailsModal';

const AssetList = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchAssets({ page, size: Number(pageSize) || 10 }));
  }, [dispatch, page, pageSize]);

  const handlePageSizeChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setPageSize('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setPageSize(num);
      setPage(0);
    }
  };

  const handlePageSizeBlur = () => {
    if (!pageSize || Number(pageSize) < 1) {
      setPageSize(10);
      setPage(0);
    }
  };

  const filteredItems = (items || []).filter(asset => {
    const matchesSearch = asset.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...Array.from(new Set((items || []).map(a => a.category).filter(Boolean)))];

  const canManage = user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';

  const handleOpenCreate = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  if (loading && items.length === 0) return (
    <div className="page-container asset-page">
      <div className="skeleton-hero-banner shimmer"></div>
      <div className="skeleton-table shimmer"></div>
    </div>
  );

  return (
    <div className="page-container asset-page">
      {/* Wide Industrial Machinery Hero Banner */}
      <div 
        className="page-hero-banner industrial-assets-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.90) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.ASSETS_HERO})`
        }}
      >
        <div className="hero-banner-overlay" aria-hidden="true"></div>
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <span className="pill-dot active"></span>
            <span>EQUIPMENT REGISTRY • ASSET INTELLIGENCE</span>
          </div>
          <h1 className="hero-title">Industrial Assets Fleet</h1>
          <p className="hero-subtitle">
            Configure, inspect, and track operational parameters, lifecycle depreciation, and health status across all facility units.
          </p>
          <div className="hero-status-chips">
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">{items?.length || 0} UNITS IN VIEW</span>
            </div>
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">DEPLOYED ACROSS ALL SECTORS</span>
            </div>
          </div>
        </div>
        {canManage && (
          <div className="hero-banner-actions">
            <button className="add-btn primary-btn hero-action-btn" onClick={handleOpenCreate}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Asset</span>
            </button>
          </div>
        )}
      </div>

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingAsset(null);
        }} 
        assetToEdit={editingAsset}
      />

      <AssetDetailsModal 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
        asset={selectedAsset} 
      />

      {/* Control Bar: Search & Category Filters */}
      <div className="assets-filter-control-bar">
        <div className="search-wrapper">
          <SearchFilterBar 
            placeholder="Search by tag or name..." 
            onSearch={(val) => setSearchTerm(val)} 
          />
        </div>
        {categories.length > 2 && (
          <div className="category-filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* High-Contrast Equipment Fleet Table */}
      <div className="table-card industrial-card">
        {filteredItems.length === 0 ? (
          <EmptyState 
            title="No Assets Detected"
            message="Your industrial asset inventory matching this filter is currently empty." 
          />
        ) : (
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Install Date</th>
                  <th>Operational Status</th>
                  <th>Health Index</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <div className="asset-tag-cell">
                        <span className="asset-tag-badge">{asset.assetTag}</span>
                      </div>
                    </td>
                    <td>
                      <div className="equipment-name-cell">
                        <span className="asset-name-text">{asset.name}</span>
                      </div>
                    </td>
                    <td><span className="category-pill">{asset.category || 'General Machinery'}</span></td>
                    <td>{asset.installDate ? new Date(asset.installDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${asset.currentStatus?.toLowerCase()}`}>
                        {asset.currentStatus === 'UNDER_MAINTENANCE' 
                          ? 'Under Maintenance' 
                          : asset.currentStatus === 'ACTIVE' 
                            ? 'Active' 
                            : asset.currentStatus?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="health-index-cell">
                        <CapacityBar value={asset.currentHealth ?? 100} />
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="view-btn" onClick={() => setSelectedAsset(asset)} title="View Digital Twin Specs">
                          Details
                        </button>
                        {canManage && (
                          <>
                            <button 
                              className="edit-btn" 
                              onClick={() => handleOpenEdit(asset)}
                              title="Edit Asset"
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn" 
                              disabled={asset.currentStatus === 'DECOMMISSIONED'}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to decommission / delete asset "${asset.name}" (${asset.assetTag})?`)) {
                                  dispatch(decommissionAsset(asset.id));
                                }
                              }}
                              title="Decommission Asset"
                            >
                              Decommission
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="pagination">
        <div className="pagination-size-wrapper">
          <span>Items per page:</span>
          <input
            type="number"
            min="1"
            max="100"
            className="pagination-size-input"
            value={pageSize}
            onChange={handlePageSizeChange}
            onBlur={handlePageSizeBlur}
            title="Items per page"
          />
        </div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="pagination-page-indicator">Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AssetList;
