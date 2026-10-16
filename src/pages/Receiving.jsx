import { useApp } from '../context/AppContext'
export default function Receiving() {
  const { state, dispatch } = useApp()
  const pending = state.purchaseOrders.filter(p => p.status !== 'received')
  return (
    <div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>PO Number</th><th>Supplier</th><th>Status</th><th>Items</th><th>Total</th><th>Action</th></tr></thead>
        <tbody>
          {pending.length === 0 ? <tr><td colSpan={6} className="empty-state">No pending receipts</td></tr> : pending.map(po => {
            const sup = state.suppliers.find(s => s.id === po.supplierId)
            return (
              <tr key={po.id}>
                <td><strong>{po.number}</strong></td><td>{sup?.name}</td>
                <td><span className="badge badge-warning">{po.status}</span></td>
                <td>{po.items.length} item(s)</td><td>${po.total.toLocaleString()}</td>
                <td><button className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'RECEIVE_PO', payload: po.id })}>Receive Goods</button></td>
              </tr>
            )
          })}
        </tbody>
      </table></div></div>
    </div>
  )
}
