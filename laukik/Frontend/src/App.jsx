import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PaymentSimulator from './pages/PaymentSimulator'
import AuditHistory from './pages/AuditHistory'
import SOCConsole from './pages/SOCConsole'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payment" element={<PaymentSimulator />} />
          <Route path="/audit" element={<AuditHistory />} />
          <Route path="/soc-console" element={<SOCConsole />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
