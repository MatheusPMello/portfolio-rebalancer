// client/src/components/CurrencyBadge.tsx

export interface CurrencyBadgeProps {
  currency: 'BRL' | 'USD';
  className?: string;
}

export function CurrencyBadge({ currency, className = '' }: Readonly<CurrencyBadgeProps>) {
  const isBrl = currency === 'BRL';
  const baseClass = isBrl
    ? 'bg-primary-subtle text-primary border-primary-subtle'
    : 'bg-success-subtle text-success border-success-subtle';

  return (
    <span className={`badge rounded-pill border px-3 py-2 ${baseClass} ${className}`}>
      {currency}
    </span>
  );
}
