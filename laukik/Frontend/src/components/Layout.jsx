import { Link, useLocation } from 'react-router-dom'
import { Shield, Home, CreditCard, FileText, Settings, AlertTriangle } from 'lucide-react'
import { cn } from '../utils/cn'

export default function Layout({ children }) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Payment Simulator', href: '/payment', icon: CreditCard },
    { name: 'Audit History', href: '/audit', icon: FileText },
    { name: 'SOC Console', href: '/soc-console', icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agentic Guardian</h1>
                <p className="text-xs text-slate-400">Real-Time Payment Security</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>&copy; 2026 Agentic Guardian. KURUKSHETRA 2.0 - Midnight Ciphers</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span>System Operational</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
