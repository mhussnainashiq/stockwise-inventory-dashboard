import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function Suppliers() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const openAdd = () => { setForm({ name: '', email: '', phone: '', address: '' }); setModal('add') }
  const openEdit = (s) => { setForm({ ...s }); setModal(s) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (modal === 'add') dispatch({ type: 'ADD_SUPPLIER', payload: form })
    else dispatch({ type: 'UPDATE_SUPPLIER', payload: form })
    setModal(null)
  }
  return (
    <div>
      <div className="toolbar"><button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Supplier</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
        <tbody>{state.suppliers.map(s => (
          <tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.email}</td><td>{s.phone}</td><td>{s.address}</td>
          <td><button className="btn-icon" onClick={() => openEdit(s)}><Pencil size={16} /></button>
          <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_SUPPLIER', payload: s.id }) }}><Trash2 size={16} /></button></td></tr>
        ))}</tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Supplier' : 'Edit'}<button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-grid">
              <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label>Address</label><input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            </div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div></form>
          </div>
        </div>
      )}
    </div>
  )
}
