// client/src/components/CurrencyBadge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrencyBadge } from './CurrencyBadge';

describe('CurrencyBadge Component', () => {
  it('should render BRL currency badge correctly', () => {
    render(<CurrencyBadge currency="BRL" />);
    const badge = screen.getByText('BRL');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary-subtle');
    expect(badge).toHaveClass('text-primary');
    expect(badge).not.toHaveTextContent('🇧🇷');
  });

  it('should render USD currency badge correctly', () => {
    render(<CurrencyBadge currency="USD" />);
    const badge = screen.getByText('USD');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-success-subtle');
    expect(badge).toHaveClass('text-success');
    expect(badge).not.toHaveTextContent('🇺🇸');
  });

  it('should apply custom className', () => {
    render(<CurrencyBadge currency="USD" className="custom-class" />);
    const badge = screen.getByText('USD');
    expect(badge).toHaveClass('custom-class');
  });
});
