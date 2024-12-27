import React, { useState, useEffect } from "react";
import "./FormModal.css";

const FormModal = ({ isOpen, onClose, onSubmit, initialData, formFields }) => {
  const [formData, setFormData] = useState({});

  // Preencher os campos ao editar os dados
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData, // Preenche o formulário com os dados iniciais
      });
    } else {
      // Preenche o formulário com os campos vazios se não houver dados iniciais
      const initialFormData = formFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [initialData, formFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envia o payload para salvar
    onSubmit(formData);

    // Limpa o formulário após salvar
    const initialFormData = formFields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
    setFormData(initialFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? "Editar Dados" : "Adicionar Dados"}</h2>
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}:</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || ""}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Salvar
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
