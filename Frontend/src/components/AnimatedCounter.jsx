import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    // If value contains non-numeric suffix like 'ms' or '%'
    const match = String(value).match(/^([0-9,.]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const rawNum = parseFloat(match[1].replace(/,/g, ''))
    const suffix = match[2] || ''

    if (isNaN(rawNum)) {
      setDisplayValue(value)
      return
    }

    let startTime = null
    const startValue = 0

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const current = startValue + (rawNum - startValue) * easeOutExpo

      const formatted = rawNum % 1 === 0
        ? Math.round(current).toLocaleString()
        : current.toFixed(1)

      setDisplayValue(`${formatted}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [value, duration])

  return <span className="font-mono">{displayValue}</span>
}
