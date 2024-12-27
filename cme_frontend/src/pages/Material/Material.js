import React, { useState } from "react";
import MaterialService from "../../services/MaterialService";
import { saveAs } from 'file-saver';
import Table from "../../components/Table/Table";
import TrackingModal from "../../components/TrackingModal/TrackingModal";
import './Material.css';

const Material = () => {
  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openTrackingModal = (item) => {
    setSelectedItem(item);
    setTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setSelectedItem(null);
    setTrackingModalOpen(false);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await MaterialService.downloadReportPdf();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, 'serial_report.pdf');
    } catch (err) {
      console.error('Erro ao baixar o PDF:', err);
    }
  };

  const handleDownloadXlsx = async () => {
    try {
      const response = await MaterialService.downloadReportXlsx();
      const blob = new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      saveAs(blob, 'serial_report.xlsx');
    } catch (err) {
      console.error('Erro ao baixar o XLSX:', err);
    }
  };


  const formFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'material_type', label: 'Tipo de material', type: 'text', required: true },
    { name: 'expiration_date', label: 'Data de expiração', type: 'date', required: true }
  ];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'material_type', label: 'Tipo do material' },
    { key: 'expiration_date', label: 'Data de expiração' },
    { key: 'serial', label: 'Serial' }
  ];

  const extraSettings = {
    manager: true,
    name: 'Gerenciar Material',
    actions: [
      { label: 'Rastrear', onClick: (item) => openTrackingModal(item) },
    ],
  };

  return (
    <div>
      <Table
        extraSettings={extraSettings}
        service={MaterialService}
        columns={columns}
        formFields={formFields}
      />

      <div className="material-buttons">
        <button className="btn-download-pdf" onClick={handleDownloadPdf}>
          Baixar PDF
        </button>
        <button className="btn-download-xlsx" onClick={handleDownloadXlsx}>
          Baixar XLSX
        </button>
      </div>

      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={closeTrackingModal}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default Material;
