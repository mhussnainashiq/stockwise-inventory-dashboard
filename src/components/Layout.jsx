import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tags, Warehouse, ArrowLeftRight, Truck, ClipboardList, PackageCheck, AlertTriangle, BarChart3, Settings, Menu, X, Moon, Sun, Boxes } from 'lucide-react'
import { useApp } from '../context/AppContext'
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/categories', icon: Tags, label: 'Categories' },
  { to: '/warehouses', icon: Warehouse, label: 'Warehouses' },
  { to: '/movements', icon: ArrowLeftRight, label: 'Stock Movements' },
  { to: '/suppliers', icon: Truck, label: 'Suppliers' },
  { to: '/purchase-orders', icon: ClipboardList, label: 'Purchase Orders' },
  { to: '/receiving', icon: PackageCheck, label: 'Goods Receiving' },
  { to: '/alerts', icon: AlertTriangle, label: 'Low-Stock Alerts' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]
const titles = { '/': 'Dashboard', '/products': 'Products', '/categories': 'Categories', '/warehouses': 'Warehouses', '/movements': 'Stock Movements', '/suppliers': 'Suppliers', '/purchase-orders': 'Purchase Orders', '/receiving': 'Goods Receiving', '/alerts': 'Low-Stock Alerts', '/reports': 'Reports', '/settings': 'Settings' }
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, dispatch } = useApp()
  const location = useLocation()
  const title = titles[location.pathname] || 'StockWise'
  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand"><Boxes size={28} /><div>Stock<span>Wise</span></div></div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <item.icon size={20} />{item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="btn-icon menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
            <h1 className="header-title">{title}</h1>
          </div>
          <div className="header-actions">
            <button className="btn-icon" onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} aria-label="Theme">
              {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
      {sidebarOpen && <div className="modal-overlay" style={{ zIndex: 90, background: 'rgba(0,0,0,0.3)' }} onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
