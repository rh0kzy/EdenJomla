'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, push, onValue, remove } from 'firebase/database';
import { Facture, PerfumeItem } from '@/types';

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

  const addItemToList = () => {
    if (!currentItem.name || currentItem.weight <= 0 || currentItem.pricePerUnit <= 0) {
      alert('Please fill all item fields correctly');
      return;
    }

    const totalPrice = currentItem.weight * currentItem.pricePerUnit;
    setItems([...items, { ...currentItem, totalPrice }]);
    setCurrentItem({ name: '', weight: 0, weightUnit: 'g', pricePerUnit: 0 });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
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

  return (
    <div className="container">
      <div className="card">
        <h1>🌸 EdenJomla - Perfume Factures</h1>
        <p style={{ color: '#718096', marginBottom: '20px' }}>
          Manage your perfume invoices with weight and pricing
        </p>
        
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
            <div className="form-group">
              <label>Perfume Name</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="e.g., Rose Oud"
              />
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
              <label>Price per Unit (€)</label>
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
                      <td>€{item.pricePerUnit.toFixed(2)}</td>
                      <td>€{item.totalPrice.toFixed(2)}</td>
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
                  <tr style={{ fontWeight: 'bold', background: '#f7fafc' }}>
                    <td colSpan={4}>Total Amount</td>
                    <td colSpan={2}>
                      €{items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
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
          <p style={{ color: '#718096', textAlign: 'center', padding: '40px' }}>
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
                        <div key={idx} style={{ fontSize: '12px', color: '#718096' }}>
                          {item.name} ({item.weight}{item.weightUnit})
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#48bb78' }}>
                      €{facture.totalAmount.toFixed(2)}
                    </td>
                    <td>{new Date(facture.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => deleteFacture(facture.id)}
                        style={{ padding: '6px 12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
