import './App.css'

const FEATURES = [
  {
    title: 'Tier 0 · Instant',
    body: 'Name-clash and authority-handle checks run in-memory, sub-10ms, on every single transaction.',
  },
  {
    title: 'Tier 1 · Forensic',
    body: 'Rapid-drainage, mule-account, drip-escalation, and community-report signals escalate only when needed.',
  },
  {
    title: 'Tier 2 · Network-wide',
    body: 'Cross-PSP campaign detection and a nationwide kill-switch, simulated end-to-end across banks.',
  },
]

export default function App() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="brand">Kurukshetra</span>
        <a className="nav-cta" href="/main">Launch demo</a>
      </header>

      <main className="hero">
        <p className="eyebrow">Fraud interception for UPI</p>
        <h1>Stop the payment before the money moves.</h1>
        <p className="subhead">
          A simulated end-to-end UPI ecosystem — mock NPCI switch, PSP apps, and
          core banking — wired to a real-time risk engine that scores every
          transaction and intervenes before it settles.
        </p>
        <a className="cta" href="/main">Launch the live demo &rarr;</a>
      </main>

      <section className="features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <span>Every response is labeled Real, Simulated, or Conceptual — nothing here hides what's mocked.</span>
      </footer>
    </div>
  )
}
