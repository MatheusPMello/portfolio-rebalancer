// /client/src/components/common/Modal.tsx
import React from 'react';

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /** If true, the modal is rendered visible. */
  show: boolean;
  /** The title text displayed in the header. */
  title: string;
  /** Callback triggered when clicking the close button. */
  onClose: () => void;
  /** Inner content of the modal body. */
  children: React.ReactNode;
  /** Size modifier for the modal dialog. */
  size?: 'sm' | 'lg' | 'xl';
}

/**
 * Reusable modal overlay component wrapper using Bootstrap classes.
 *
 * @param props - Component props containing show flag, title, callback, and layout options.
 * @returns React modal element or null if show is false.
 */
export function Modal({ show, title, onClose, children, size }: Readonly<ModalProps>) {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog ${size ? 'modal-' + size : ''}`}>
        <div className="modal-content">
          <div className="modal-header align-items-center">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              style={{ minWidth: '44px', minHeight: '44px', padding: '12px' }}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
