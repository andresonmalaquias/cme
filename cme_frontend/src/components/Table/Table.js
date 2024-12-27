import React, { useState, useEffect } from "react";
import "./Table.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import FormModal from "../FormModal/FormModal"; // Atualize o nome se necessário

const Table = ({ extraSettings, service, columns, mapRowData, formFields }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  // Estados para modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('add'); // 'add' | 'edit' | 'delete'

  useEffect(() => {
    loadData();
  }, [offset, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await service.get(limit, offset, search);
      setData(response.results || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setOffset(0); // Reinicia a paginação
  };

  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
    }
  };

  const handlePreviousPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  // Modal Actions
  const openFormModal = (action, item = null) => {
    setActionType(action);
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const openConfirmModal = (item) => {
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmAction = async () => {
    try {
      await service.delete(selectedItem.id);
      closeModals();
      loadData();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (actionType === 'add') {
        await service.add(formData);
      } else if (actionType === 'edit') {
        await service.edit(selectedItem.id, formData);
      }
      closeModals();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="list-container">
      <h1>{extraSettings.name}</h1>
      <div className="list-actions">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={handleSearch}
        />
        {extraSettings.manager && (
          <button className="btn-add" onClick={() => openFormModal('add')}>
            Adicionar Novo
          </button>
        )}
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {extraSettings.manager && (
                  <th>Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  {columns.map((col) => (
                    <td key={col.key}>{mapRowData ? mapRowData(item, col.key) : item[col.key]}</td>
                  ))}
                  {extraSettings.manager && (
                    <td>
                      <button onClick={() => openFormModal('edit', item)}>Editar</button>
                      <button onClick={() => openConfirmModal(item)}>Excluir</button>
                      {extraSettings.actions?.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(item)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={offset === 0}>
              Anterior
            </button>
            <span>
              Página {Math.ceil(offset / limit) + 1} de {Math.ceil(totalCount / limit)}
            </span>
            <button onClick={handleNextPage} disabled={offset + limit >= totalCount}>
              Próxima
            </button>
          </div>
        </>
      )}
      
      {/* Modais */}
      {isFormModalOpen && (
        <FormModal
          isOpen={isFormModalOpen}
          onClose={closeModals}
          onSubmit={handleFormSubmit}
          actionType={actionType}
          initialData={selectedItem}
          formFields={formFields}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={closeModals}
          onConfirm={handleConfirmAction}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default Table;
