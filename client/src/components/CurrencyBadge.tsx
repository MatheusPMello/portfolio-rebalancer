// client/src/components/CurrencyBadge.tsx

/**
 * Props for the CurrencyBadge component.
 */
export interface CurrencyBadgeProps {
  /** The ISO code of the currency to display ('BRL' or 'USD'). */
  currency: 'BRL' | 'USD';
  /** Optional custom CSS classes. */
  className?: string;
}

/**
 * Renders a stylized badge representing the asset's currency (BRL or USD).
 *
 * @param props - Component props containing currency and optional className.
 * @returns React component displaying a currency pill.
 */
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
