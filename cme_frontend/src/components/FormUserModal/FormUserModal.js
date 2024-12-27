import React, { useState, useEffect } from 'react';
import "./FormUserModal.css";

const FormUserModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    type: 'T', // Tipo com valor padrão
  });

  // Preencher os campos ao editar um usuário
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        name: initialData.name || '',
        password: '', // Deixar vazio ao editar
        type: initialData.type || 'T', // Preenche o tipo com o valor atual
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se a senha está vazia e, se estiver, não inclui no payload
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password; // Remove o campo senha do payload se estiver vazio
    }

    onSave(payload); // Envia o payload para salvar
    setFormData({ username: '', name: '', password: '', type: 'T' }); // Limpa o formulário
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Editar Usuário' : 'Adicionar Usuário'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={initialData ? "Deixe em branco para não alterar" : ""}
            />
          </div>

          {/* Campo de seleção para o tipo de usuário */}
          <div className="form-group">
            <label>Tipo:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="T">Técnico</option>
              <option value="N">Enfermagem</option>
              <option value="A">Administrativo</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormUserModal;
