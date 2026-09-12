export default function NeonCard({
  children,
  className = '',
  glowColor = '#00d4ff',
  style = {},
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: `1px solid ${glowColor}25`,
        boxShadow: `0 0 25px ${glowColor}08, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${glowColor}50`
        e.currentTarget.style.boxShadow = `0 0 35px ${glowColor}18, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${glowColor}25`
        e.currentTarget.style.boxShadow = `0 0 25px ${glowColor}08, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top ambient highlight line */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}60, transparent)`,
        }}
      />
      {children}
    </div>
  )
}
