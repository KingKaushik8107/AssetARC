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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    dispatch(fetchAssets(page));
  }, [dispatch, page]);

  const filteredItems = items.filter(asset => 
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading assets...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Industrial Assets</h1>
        {user?.role === 'ASSET_MANAGER' && (
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>Add Asset</button>
        )}
      </div>

      <AssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AssetDetailsModal 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
        asset={selectedAsset} 
      />

      <SearchFilterBar 
        placeholder="Search by tag or name..." 
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
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Health</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.assetTag}</strong></td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    <span className={`status-badge ${asset.currentStatus.toLowerCase()}`}>
                      {asset.currentStatus}
                    </span>
                  </td>
                  <td>
                    <CapacityBar value={asset.currentHealth || 100} />
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => setSelectedAsset(asset)}>Details</button>
                    {user?.role === 'ASSET_MANAGER' && (
                      <button 
                        className="delete-btn" 
                        disabled={asset.currentStatus === 'DECOMMISSIONED'}
                        onClick={() => {
                          if(window.confirm('Are you sure you want to decommission this asset?')) {
                            dispatch(decommissionAsset(asset.id));
                          }
                        }}
                      >
                        Decommission
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AssetList;
