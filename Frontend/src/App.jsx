import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hero from './pages/Hero'
import Dashboard from './pages/Dashboard'
import PaymentSimulator from './pages/PaymentSimulator'
import AuditHistory from './pages/AuditHistory'
import SOCConsole from './pages/SOCConsole'
import ArchitectureDiagram from './pages/ArchitectureDiagram'

function App() {
  return (
    <Router>
      <Routes>
        {/* Full-screen standalone pages — no nav chrome */}
        <Route path="/hero" element={<Hero />} />
        <Route path="/architecture" element={<ArchitectureDiagram />} />

        {/* Standard pages with Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/payment" element={<PaymentSimulator />} />
              <Route path="/audit" element={<AuditHistory />} />
              <Route path="/soc-console" element={<SOCConsole />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
