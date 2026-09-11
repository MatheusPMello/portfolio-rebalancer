import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('btn-custom');
    expect(btn).toHaveClass('btn-custom-solid-primary');
    expect(btn).toHaveClass('btn-custom-md');
  });

  it('applies custom variant, color, size and rounded pill', () => {
    render(
      <Button variant="outline" color="danger" size="lg" rounded="pill" className="extra-class">
        Custom
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('btn-custom-outline-danger');
    expect(btn).toHaveClass('btn-custom-lg');
    expect(btn).toHaveClass('rounded-pill');
    expect(btn).toHaveClass('extra-class');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('honors disabled attribute', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
