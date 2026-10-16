import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function Movements() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ productId: '', type: 'in', quantity: 1, warehouseId: '', notes: '' })
  const [error, setError] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    const qty = Number(form.quantity)
    if (!form.productId || qty <= 0) { setError('Valid product and quantity required'); return }
    if (form.type === 'out') {
      const prod = state.products.find(p => p.id === form.productId)
      if (!prod || prod.quantity < qty) { setError('Insufficient stock for this movement'); return }
    }
    dispatch({ type: 'ADD_MOVEMENT', payload: { ...form, quantity: qty, date: new Date().toISOString().slice(0, 10) } })
    setModal(false); setError(''); setForm({ productId: '', type: 'in', quantity: 1, warehouseId: state.warehouses[0]?.id || '', notes: '' })
  }
  return (
    <div>
      <div className="toolbar"><button className="btn btn-primary" onClick={() => { setForm({ productId: state.products[0]?.id || '', type: 'in', quantity: 1, warehouseId: state.warehouses[0]?.id || '', notes: '' }); setError(''); setModal(true) }}><Plus size={18} /> Record Movement</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Warehouse</th><th>Notes</th></tr></thead>
        <tbody>{[...state.movements].reverse().map(m => {
          const prod = state.products.find(p => p.id === m.productId)
          const wh = state.warehouses.find(w => w.id === m.warehouseId)
          return (<tr key={m.id}><td>{m.date}</td><td>{prod?.name || '—'}</td>
            <td><span className={`badge badge-${m.type === 'in' ? 'success' : 'warning'}`}>{m.type}</span></td>
            <td>{m.quantity}</td><td>{wh?.name || '—'}</td><td>{m.notes}</td></tr>)
        })}</tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Record Stock Movement <button className="btn-icon" onClick={() => setModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-grid">
                <div className="form-group"><label>Product</label><select className="form-control" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} required>{state.products.map(p => <option key={p.id} value={p.id}>{p.name} (qty: {p.quantity})</option>)}</select></div>
                <div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="in">Incoming</option><option value="out">Outgoing</option></select></div>
                <div className="form-group"><label>Quantity</label><input type="number" className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min={1} required /></div>
                <div className="form-group"><label>Warehouse</label><select className="form-control" value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: e.target.value })}>{state.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><input className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Record</button></div></form>
          </div>
        </div>
      )}
    </div>
  )
}
