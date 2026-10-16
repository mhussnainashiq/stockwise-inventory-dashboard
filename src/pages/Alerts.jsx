import { useApp } from '../context/AppContext'
export default function Alerts() {
  const { state } = useApp()
  const low = state.products.filter(p => p.quantity <= p.reorderLevel)
  return (
    <div>
      {low.length === 0 ? (
        <div className="card"><div className="card-body empty-state">All products are above reorder levels.</div></div>
      ) : (
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>SKU</th><th>Product</th><th>Current Qty</th><th>Reorder Level</th><th>Shortage</th></tr></thead>
          <tbody>{low.map(p => (
            <tr key={p.id}><td>{p.sku}</td><td><strong>{p.name}</strong></td>
            <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{p.quantity}</td>
            <td>{p.reorderLevel}</td><td>{Math.max(0, p.reorderLevel - p.quantity)}</td></tr>
          ))}</tbody>
        </table></div></div>
      )}
    </div>
  )
}
