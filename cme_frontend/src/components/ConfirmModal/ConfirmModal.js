import React from 'react';
import './ConfirmModal.css'

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir este usuário?</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
