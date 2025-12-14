import zxcvbn from 'zxcvbn'

export function validatePasswordStrength(password: string): number {
  if (!password) return 0
  return zxcvbn(password).score // 0–4
}

export function getPasswordStrengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return 'Too weak'
    case 2:
      return 'Weak'
    case 3:
      return 'Good'
    case 4:
      return 'Strong'
    default:
      return ''
  }
}
export function PasswordStrengthIndicator({ strength }: { strength: number }) {
  const labels = ['Too weak', 'Too weak', 'Weak', 'Good', 'Strong']
  const colors = [
    'text-red-500',
    'text-red-500',
    'text-yellow-500',
    'text-green-600',
    'text-green-700',
  ]
  return (
    <div className="mt-2 text-sm">
      <span className="text-muted-foreground">Strength: </span>
      <span className={colors[strength]}>
        {labels[strength]}
      </span>
    </div>
  )
}
