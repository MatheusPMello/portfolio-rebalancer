import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './ModalLayout';

describe('ModalLayout Component', () => {
  it('returns null when show is false', () => {
    const { container } = render(
      <Modal show={false} title="Test Modal" onClose={vi.fn()}>
        Modal Content
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal when show is true', () => {
    render(
      <Modal show={true} title="Test Modal" onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>,
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal show={true} title="Test Modal" onClose={handleClose}>
        Modal Content
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom size class', () => {
    const { container } = render(
      <Modal show={true} title="Test Modal" onClose={vi.fn()} size="lg">
        Modal Content
      </Modal>,
    );
    expect(container.querySelector('.modal-lg')).toBeInTheDocument();
  });
});
