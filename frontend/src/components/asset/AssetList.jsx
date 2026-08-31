import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, decommissionAsset } from '../../store/slices/assetSlice';
import EmptyState from '../common/EmptyState';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';

import AssetModal from './AssetModal';
import AssetDetailsModal from './AssetDetailsModal';

const AssetList = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    dispatch(fetchAssets(page));
  }, [dispatch, page]);

  const filteredItems = (items || []).filter(asset => 
    asset.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';

  const handleOpenCreate = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  if (loading && items.length === 0) return <div className="loading">Loading assets...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Industrial Assets Fleet</h1>
          <p className="page-subtitle">Track, configure, and monitor lifecycle health across operational units</p>
        </div>
        {canManage && (
          <button className="add-btn" onClick={handleOpenCreate}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Register Asset</span>
          </button>
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

      <SearchFilterBar 
        placeholder="Search by tag, model, or equipment name..." 
        onSearch={(val) => setSearchTerm(val)} 
      />

      <div className="table-card">
        {filteredItems.length === 0 ? (
          <EmptyState message="No matching assets found." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Install Date</th>
                <th>Current Status</th>
                <th>Health Index</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((asset) => (
                <tr key={asset.id}>
                  <td><strong className="asset-tag-badge">{asset.assetTag}</strong></td>
                  <td>
                    <span className="asset-name-text">{asset.name}</span>
                  </td>
                  <td><span className="category-pill">{asset.category}</span></td>
                  <td>{asset.installDate ? new Date(asset.installDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${asset.currentStatus?.toLowerCase()}`}>
                      {asset.currentStatus}
                    </span>
                  </td>
                  <td>
                    <CapacityBar value={asset.currentHealth ?? 100} />
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button className="view-btn" onClick={() => setSelectedAsset(asset)} title="View Specs">
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
        )}
      </div>
      
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AssetList;

