// /client/src/components/common/Modal.tsx
import React from 'react';

export interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ show, title, onClose, children }: Readonly<ModalProps>) {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
