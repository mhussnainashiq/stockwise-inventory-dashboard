import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function PurchaseOrders() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ supplierId: '', warehouseId: '', productId: '', quantity: 10 })
  const handleSubmit = (e) => {
    e.preventDefault()
    const prod = state.products.find(p => p.id === form.productId)
    if (!prod) return
    const qty = Number(form.quantity)
    dispatch({
      type: 'ADD_PO',
      payload: {
        number: `PO-2025-${String(state.purchaseOrders.length + 1).padStart(3, '0')}`,
        supplierId: form.supplierId,
        warehouseId: form.warehouseId,
        status: 'pending',
        items: [{ productId: form.productId, quantity: qty }],
        total: qty * prod.cost,
        createdAt: new Date().toISOString().slice(0, 10),
      }
    })
    setModal(false)
  }
  return (
    <div>
      <div className="toolbar"><button className="btn btn-primary" onClick={() => { setForm({ supplierId: state.suppliers[0]?.id || '', warehouseId: state.warehouses[0]?.id || '', productId: state.products[0]?.id || '', quantity: 10 }); setModal(true) }}><Plus size={18} /> New PO</button></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Number</th><th>Supplier</th><th>Warehouse</th><th>Status</th><th>Total</th><th>Date</th></tr></thead>
        <tbody>{state.purchaseOrders.map(po => {
          const sup = state.suppliers.find(s => s.id === po.supplierId)
          const wh = state.warehouses.find(w => w.id === po.warehouseId)
          return (<tr key={po.id}><td><strong>{po.number}</strong></td><td>{sup?.name}</td><td>{wh?.name}</td>
            <td><span className={`badge badge-${po.status === 'received' ? 'success' : po.status === 'ordered' ? 'info' : 'warning'}`}>{po.status}</span></td>
            <td>${po.total.toLocaleString()}</td><td>{po.createdAt}</td></tr>)
        })}</tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">New Purchase Order <button className="btn-icon" onClick={() => setModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-grid">
              <div className="form-group"><label>Supplier</label><select className="form-control" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>{state.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div className="form-group"><label>Warehouse</label><select className="form-control" value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: e.target.value })}>{state.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
              <div className="form-group"><label>Product</label><select className="form-control" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>{state.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="form-group"><label>Quantity</label><input type="number" className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min={1} /></div>
            </div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create</button></div></form>
          </div>
        </div>
      )}
    </div>
  )
}
