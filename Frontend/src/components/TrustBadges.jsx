/**
 * TrustBadges - Scrolling partner logo strip
 * Uses downloaded SVG assets from Tempo.xyz
 */

const partners = [
  { name: 'Stripe',           file: '/assets/tempo/stripe.svg' },
  { name: 'Visa',             file: '/assets/tempo/visa.svg' },
  { name: 'Mastercard',       file: '/assets/tempo/mastercard.svg' },
  { name: 'OpenAI',           file: '/assets/tempo/openai.svg' },
  { name: 'Revolut',          file: '/assets/tempo/revolut.svg' },
  { name: 'Klarna',           file: '/assets/tempo/klarna.svg' },
  { name: 'Shopify',          file: '/assets/tempo/shopify.svg' },
  { name: 'Deutsche Bank',    file: '/assets/tempo/deutsche-bank.svg' },
  { name: 'Anthropic',        file: '/assets/tempo/anthropic.svg' },
  { name: 'Brex',             file: '/assets/tempo/brex.svg' },
  { name: 'Deel',             file: '/assets/tempo/deel.svg' },
  { name: 'Nubank',           file: '/assets/tempo/nubank.svg' },
  { name: 'Mercury',          file: '/assets/tempo/mercury.svg' },
  { name: 'Ramp',             file: '/assets/tempo/ramp.svg' },
  { name: 'Payoneer',         file: '/assets/tempo/payoneer.svg' },
  { name: 'Kraken',           file: '/assets/tempo/kraken.svg' },
  { name: 'Doordash',         file: '/assets/tempo/doordash.svg' },
  { name: 'Gusto',            file: '/assets/tempo/gusto.svg' },
  { name: 'UBS',              file: '/assets/tempo/ubs.svg' },
  { name: 'Standard Chartered', file: '/assets/tempo/standard-chartered.svg' },
]

export default function TrustBadges() {
  // Duplicate for seamless loop
  const doubled = [...partners, ...partners]

  return (
    <div className="py-10 overflow-hidden">
      <p className="text-center text-sm text-slate-500 mb-6 tracking-widest uppercase">
        Trusted payment infrastructure
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling strip */}
        <div className="flex items-center gap-10 animate-scroll whitespace-nowrap">
          {doubled.map((p, idx) => (
            <img
              key={`${p.name}-${idx}`}
              src={p.file}
              alt={p.name}
              title={p.name}
              className="h-6 w-auto opacity-30 hover:opacity-70 transition-opacity duration-300 grayscale hover:grayscale-0 flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
