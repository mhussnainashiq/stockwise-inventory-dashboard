import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function Categories() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const openAdd = () => { setForm({ name: '', description: '' }); setModal('add') }
  const openEdit = (c) => { setForm({ ...c }); setModal(c) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (modal === 'add') dispatch({ type: 'ADD_CATEGORY', payload: form })
    else dispatch({ type: 'UPDATE_CATEGORY', payload: form })
    setModal(null)
  }
  return (
    <div>
      <div className="toolbar"><button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Category</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Description</th><th>Products</th><th>Actions</th></tr></thead>
        <tbody>{state.categories.map(c => (
          <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.description}</td>
          <td>{state.products.filter(p => p.categoryId === c.id).length}</td>
          <td><button className="btn-icon" onClick={() => openEdit(c)}><Pencil size={16} /></button>
          <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_CATEGORY', payload: c.id }) }}><Trash2 size={16} /></button></td></tr>
        ))}</tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Category' : 'Edit'}<button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-grid">
              <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><input className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            </div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div></form>
          </div>
        </div>
      )}
    </div>
  )
}
