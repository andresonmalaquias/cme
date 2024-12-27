import React, { useState, useEffect } from "react";
import MaterialService from "../../services/MaterialService";
import './TrackingModal.css';

const TrackingModal = ({ isOpen, onClose, selectedItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterFailures, setFilterFailures] = useState(false);
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [failureOccurred, setFailureOccurred] = useState(false);
  const [failureDescription, setFailureDescription] = useState('');

  const stepMapping = {
    'R': 'Recebimento',
    'W': 'Lavagem',
    'S': 'Esterilização',
    'D': 'Distribuição'
  };

  useEffect(() => {
    if (selectedItem) {
      loadData();
    }
  }, [selectedItem]);

  const loadData = async () => {
    if (!selectedItem) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await MaterialService.getStepSerial(selectedItem.id);
      setData(response || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError("Erro ao carregar os dados de rastreamento. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const mapStepToLabel = (step) => {
    return stepMapping[step] || step;
  };

  const filteredData = data.filter((item) => {
    const step = item.step ? mapStepToLabel(item.step).toLowerCase() : '';
    const failureDescription = item.failure_description ? item.failure_description.toLowerCase() : '';
    const matchesSearchTerm = step.includes(searchTerm.toLowerCase()) || failureDescription.includes(searchTerm.toLowerCase());
    const matchesFailureFilter = !filterFailures || item.failure_occurred;

    return matchesSearchTerm && matchesFailureFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
  };

  const handleNextStep = async () => {
    const payload = {
      material_id: selectedItem.id,
      failure_occurred: failureOccurred,
      failure_description: failureOccurred ? failureDescription : null
    };

    try {
      await MaterialService.addNextStep(selectedItem.id, payload);
      setShowNextStepModal(false);
      loadData();
    } catch (err) {
      console.error('Erro ao registrar o próximo passo:', err);
    }
  };

  const handleCancel = () => {
    setShowNextStepModal(false);
    setFailureOccurred(false);
    setFailureDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="tracking-modal-overlay">
      <div className="tracking-modal">
        <div className="tracking-modal-header">
          <h4>Rastreamento do serial: {selectedItem.serial}</h4>
          <button onClick={onClose}>✖️</button>
        </div>

        <div className="tracking-search">
          <input
            type="text"
            placeholder="Buscar por etapa ou falha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-failures">
          <label>
            <input
              type="checkbox"
              checked={filterFailures}
              onChange={() => setFilterFailures(prev => !prev)}
            />
            Exibir apenas itens com falha
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading">Carregando...</div>}

        <div className="tracking-list">
          {filteredData.length === 0 && !isLoading && !error && <p>Nenhum registro encontrado.</p>}
          {filteredData.map((item) => (
            <div key={item.id} className="tracking-item">
              <span><strong>Data de Criação:</strong> {formatDate(item.created_at)}</span>
              <span><strong>Etapa:</strong> {mapStepToLabel(item.step)}</span>
              <span><strong>Falha:</strong> {item.failure_occurred ? "Sim" : "Não"}</span>
              {item.failure_occurred && item.failure_description && (
                <span><strong>Descrição da Falha:</strong> {item.failure_description}</span>
              )}
            </div>
          ))}
        </div>

        <div className="tracking-modal-actions">
          <button className="btn-failure" onClick={() => setShowNextStepModal(true)}>
            Próximo Passo
          </button>
        </div>
      </div>

      {showNextStepModal && (
        <div className="next-step-modal-overlay">
          <div className="next-step-modal">
            <div className="next-step-modal-header">
              <h4>Registrar Próximo Passo</h4>
              <button onClick={handleCancel}>✖️</button>
            </div>

            <div className="next-step-modal-content">
              <label>
                <input
                  type="checkbox"
                  checked={failureOccurred}
                  onChange={() => setFailureOccurred(prev => !prev)}
                />
                Houve falha?
              </label>

              {failureOccurred && (
                <div>
                  <label>Descrição da Falha:</label>
                  <textarea
                    value={failureDescription}
                    onChange={(e) => setFailureDescription(e.target.value)}
                    placeholder="Descreva o ocorrido..."
                  />
                </div>
              )}
            </div>

            <div className="next-step-modal-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleNextStep}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingModal;
