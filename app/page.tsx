'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { database } from '@/lib/firebase';
import { ref, push, onValue, remove } from 'firebase/database';
import { Facture, PerfumeItem } from '@/types';

interface Perfume {
  id: string;
  name: string;
  reference: string;
  brandName: string;
  price: string;
}

export default function Home() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState<Omit<PerfumeItem, 'id' | 'createdAt'>[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    weight: 0,
    weightUnit: 'g' as 'g' | 'kg',
    pricePerUnit: 0,
  });
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarView, setSidebarView] = useState<'factures' | 'clients'>('factures');

  // Check if mobile on mount and close sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowSidebar(false);
      }
    };
    
    // Check on mount
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load perfumes from Firebase
  useEffect(() => {
    const perfumesRef = ref(database, 'perfumes');
    const unsubscribe = onValue(perfumesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const perfumesList: Perfume[] = Object.keys(data).map((key) => ({
          id: data[key].id || key,
          name: data[key].name || '',
          reference: data[key].reference || '',
          brandName: data[key].brandName || '',
          price: data[key].price || '',
        }));
        setPerfumes(perfumesList);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const facturesRef = ref(database, 'factures');
    const unsubscribe = onValue(facturesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const facturesList: Facture[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFactures(facturesList.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setFactures([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.autocomplete-dropdown') && !target.closest('input')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePerfumeNameChange = (value: string) => {
    setCurrentItem({ ...currentItem, name: value });
    
    if (value.trim().length > 0) {
      const filtered = perfumes.filter(perfume =>
        perfume.name.toLowerCase().includes(value.toLowerCase()) ||
        (perfume.brandName && perfume.brandName.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 10); // Limit to 10 suggestions
      
      setFilteredPerfumes(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredPerfumes([]);
      setShowSuggestions(false);
    }
  };

  const selectPerfume = (perfume: Perfume) => {
    setCurrentItem({ 
      ...currentItem, 
      name: perfume.name,
      pricePerUnit: perfume.price ? parseFloat(perfume.price) : 0
    });
    setShowSuggestions(false);
    setFilteredPerfumes([]);
  };

  const addItemToList = () => {
    if (!currentItem.name || currentItem.weight <= 0 || currentItem.pricePerUnit <= 0) {
      alert('Please fill all item fields correctly');
      return;
    }

    // Calculate total price based on unit
    let totalPrice;
    if (currentItem.weightUnit === 'g') {
      // Price is per 100g, so divide weight by 100
      totalPrice = (currentItem.weight / 100) * currentItem.pricePerUnit;
    } else {
      // Price is per 1kg (1000g), so divide weight by 1 (it's already in kg)
      totalPrice = currentItem.weight * currentItem.pricePerUnit;
    }
    
    setItems([...items, { ...currentItem, totalPrice }]);
    setCurrentItem({ name: '', weight: 0, weightUnit: 'g', pricePerUnit: 0 });
    setShowSuggestions(false);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Get unique clients with their facture count and total amount
  const getUniqueClients = () => {
    const clientsMap = new Map<string, { name: string; factureCount: number; totalAmount: number }>();
    
    factures.forEach((facture) => {
      const existing = clientsMap.get(facture.clientName);
      if (existing) {
        existing.factureCount += 1;
        existing.totalAmount += facture.totalAmount;
      } else {
        clientsMap.set(facture.clientName, {
          name: facture.clientName,
          factureCount: 1,
          totalAmount: facture.totalAmount,
        });
      }
    });
    
    return Array.from(clientsMap.values()).sort((a, b) => b.factureCount - a.factureCount);
  };

  const createFacture = async () => {
    if (!clientName || items.length === 0) {
      alert('Please add client name and at least one item');
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const factureNumber = `FAC-${Date.now()}`;
    const timestamp = Date.now();

    const itemsWithIds = items.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      createdAt: timestamp,
    }));

    const newFacture: Omit<Facture, 'id'> = {
      factureNumber,
      clientName,
      items: itemsWithIds,
      totalAmount,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      const facturesRef = ref(database, 'factures');
      await push(facturesRef, newFacture);
      
      // Reset form
      setClientName('');
      setItems([]);
      setShowForm(false);
      alert('Facture created successfully!');
    } catch (error) {
      console.error('Error creating facture:', error);
      alert('Error creating facture. Please try again.');
    }
  };

  const deleteFacture = async (id: string) => {
    if (confirm('Are you sure you want to delete this facture?')) {
      try {
        const factureRef = ref(database, `factures/${id}`);
        await remove(factureRef);
        alert('Facture deleted successfully!');
      } catch (error) {
        console.error('Error deleting facture:', error);
        alert('Error deleting facture. Please try again.');
      }
    }
  };

  const viewInvoice = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowInvoice(true);
    // Close sidebar on mobile when viewing invoice
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('invoice');
    
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `Invoice_${selectedFacture?.factureNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (showInvoice && selectedFacture) {
    return (
      <div className="invoice-container">
        <div className="invoice-page" id="invoice">
          {/* Header */}
          <div className="invoice-header">
            <div className="invoice-logo-section">
              <img 
                src="/eden-parfum-logo.png" 
                alt="Eden Parfum Logo" 
                className="invoice-logo"
              />
              <h1>Eden Parfum</h1>
            </div>
            <div className="invoice-title-section">
              <h2>Facture</h2>
              <p>Date: {new Date(selectedFacture.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="invoice-info-section">
            <div className="invoice-client-info" style={{ gridColumn: '1 / -1' }}>
              <h3>Client:</h3>
              <p><strong>{selectedFacture.clientName}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Perfume Name</th>
                <th>Weight</th>
                <th>Unit</th>
                <th>Price/Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedFacture.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.weightUnit}</td>
                  <td>
                    {item.pricePerUnit.toFixed(2)} DZD / {item.weightUnit === 'g' ? '100g' : '1kg'}
                  </td>
                  <td>{item.totalPrice.toFixed(2)} DZD</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-right"><strong>Total Amount:</strong></td>
                <td><strong>{selectedFacture.totalAmount.toFixed(2)} DZD</strong></td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="invoice-footer">
            <p>Thank you for your business!</p>
            <p className="invoice-note">This is a proforma invoice and serves as a quotation.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="invoice-actions no-print">
          <button className="btn btn-secondary" onClick={printInvoice}>
            🖨️ Print Invoice
          </button>
          <button className="btn btn-secondary" onClick={downloadPDF}>
            📥 Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowInvoice(false)}>
            ← Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <h3>📊 History</h3>
          <button 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Close sidebar" : "Open sidebar"}
          >
            {showSidebar ? '✕' : '☰'}
          </button>
        </div>
        
        {showSidebar && (
          <>
            <div className="sidebar-tabs">
              <button 
                className={`sidebar-tab ${sidebarView === 'factures' ? 'active' : ''}`}
                onClick={() => setSidebarView('factures')}
              >
                📄 Factures ({factures.length})
              </button>
              <button 
                className={`sidebar-tab ${sidebarView === 'clients' ? 'active' : ''}`}
                onClick={() => setSidebarView('clients')}
              >
                👥 Clients ({getUniqueClients().length})
              </button>
            </div>

            <div className="sidebar-content">
              {sidebarView === 'factures' ? (
                <div className="sidebar-list">
                  {factures.length === 0 ? (
                    <p className="sidebar-empty">No factures yet</p>
                  ) : (
                    factures.slice().reverse().map((facture) => (
                      <div 
                        key={facture.id} 
                        className="sidebar-item"
                        onClick={() => viewInvoice(facture)}
                      >
                        <div className="sidebar-item-header">
                          <strong>{facture.factureNumber}</strong>
                          <span className="sidebar-item-amount">
                            {facture.totalAmount.toFixed(0)} DZD
                          </span>
                        </div>
                        <div className="sidebar-item-client">{facture.clientName}</div>
                        <div className="sidebar-item-date">
                          {new Date(facture.createdAt).toLocaleDateString('en-GB')}
                        </div>
                        <div className="sidebar-item-items">
                          {facture.items.length} item(s)
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="sidebar-list">
                  {getUniqueClients().length === 0 ? (
                    <p className="sidebar-empty">No clients yet</p>
                  ) : (
                    getUniqueClients().map((client, idx) => (
                      <div key={idx} className="sidebar-item">
                        <div className="sidebar-item-header">
                          <strong>{client.name}</strong>
                        </div>
                        <div className="sidebar-item-stats">
                          <span>📄 {client.factureCount} facture(s)</span>
                        </div>
                        <div className="sidebar-item-total">
                          Total: {client.totalAmount.toFixed(0)} DZD
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
    <div className="container">
      <div className="card">
        <div className="logo-container">
          <Image 
            src="/logo.webp" 
            alt="Eden Parfum Logo" 
            width={80} 
            height={80} 
            className="logo"
            priority
          />
          <div>
            <h1 style={{ margin: 0 }}>EdenJomla - Perfume Factures</h1>
            <p style={{ color: '#9090a0', marginBottom: 0, marginTop: '8px' }}>
              Manage your perfume invoices with weight and pricing
            </p>
          </div>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ New Facture'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Create New Facture</h2>
          
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>

          <h3>Add Items</h3>
          <div className="grid grid-3">
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Perfume Name</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => handlePerfumeNameChange(e.target.value)}
                onFocus={() => {
                  if (currentItem.name && filteredPerfumes.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Type perfume name..."
                autoComplete="off"
              />
              {showSuggestions && filteredPerfumes.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredPerfumes.map((perfume) => (
                    <div
                      key={perfume.id}
                      className="autocomplete-item"
                      onClick={() => selectPerfume(perfume)}
                    >
                      <div style={{ fontWeight: '600' }}>{perfume.name}</div>
                      {perfume.brandName && (
                        <div style={{ fontSize: '12px', color: '#9090a0' }}>
                          {perfume.brandName} {perfume.reference && `- ${perfume.reference}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Weight</label>
              <input
                type="number"
                value={currentItem.weight || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, weight: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={currentItem.weightUnit}
                onChange={(e) => setCurrentItem({ ...currentItem, weightUnit: e.target.value as 'g' | 'kg' })}
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price per Unit (DZD)</label>
              <input
                type="number"
                value={currentItem.pricePerUnit || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, pricePerUnit: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={addItemToList}>
                ➕ Add Item
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <>
              <h3>Items List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Perfume Name</th>
                    <th>Weight</th>
                    <th>Unit</th>
                    <th>Price/Unit</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.weight}</td>
                      <td>{item.weightUnit}</td>
                      <td>{item.pricePerUnit.toFixed(2)} DZD / {item.weightUnit === 'g' ? '100g' : '1kg'}</td>
                      <td>{item.totalPrice.toFixed(2)} DZD</td>
                      <td>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => removeItem(index)}
                          style={{ padding: '6px 12px' }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 'bold', background: '#2a2a3e' }}>
                    <td colSpan={4}>Total Amount</td>
                    <td colSpan={2}>
                      {items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} DZD
                    </td>
                  </tr>
                </tbody>
              </table>

              <button 
                className="btn btn-primary" 
                onClick={createFacture}
                style={{ marginTop: '20px' }}
              >
                💾 Save Facture
              </button>
            </>
          )}
        </div>
      )}

      <div className="card">
        <h2>Factures List</h2>
        {factures.length === 0 ? (
          <p style={{ color: '#9090a0', textAlign: 'center', padding: '40px' }}>
            No factures yet. Create your first one!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Facture #</th>
                  <th>Client</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((facture) => (
                  <tr key={facture.id}>
                    <td>{facture.factureNumber}</td>
                    <td>{facture.clientName}</td>
                    <td>
                      {facture.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '12px', color: '#9090a0' }}>
                          {item.name} ({item.weight}{item.weightUnit})
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#48bb78' }}>
                      {facture.totalAmount.toFixed(2)} DZD
                    </td>
                    <td>{new Date(facture.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => viewInvoice(facture)}
                          style={{ padding: '6px 12px' }}
                        >
                          📄 View
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => deleteFacture(facture.id)}
                          style={{ padding: '6px 12px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}
