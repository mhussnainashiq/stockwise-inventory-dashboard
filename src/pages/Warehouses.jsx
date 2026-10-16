import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function Warehouses() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', location: '', capacity: 1000 })
  const openAdd = () => { setForm({ name: '', location: '', capacity: 1000 }); setModal('add') }
  const openEdit = (w) => { setForm({ ...w }); setModal(w) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = { ...form, capacity: Number(form.capacity) }
    if (modal === 'add') dispatch({ type: 'ADD_WAREHOUSE', payload })
    else dispatch({ type: 'UPDATE_WAREHOUSE', payload })
    setModal(null)
  }
  return (
    <div>
      <div className="toolbar"><button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Warehouse</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Location</th><th>Capacity</th><th>Products</th><th>Actions</th></tr></thead>
        <tbody>{state.warehouses.map(w => (
          <tr key={w.id}><td><strong>{w.name}</strong></td><td>{w.location}</td><td>{w.capacity}</td>
          <td>{state.products.filter(p => p.warehouseId === w.id).length}</td>
          <td><button className="btn-icon" onClick={() => openEdit(w)}><Pencil size={16} /></button>
          <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_WAREHOUSE', payload: w.id }) }}><Trash2 size={16} /></button></td></tr>
        ))}</tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Warehouse' : 'Edit'}<button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-grid">
              <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="form-group"><label>Capacity</label><input type="number" className="form-control" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} min={0} /></div>
            </div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div></form>
          </div>
        </div>
      )}
    </div>
  )
}
