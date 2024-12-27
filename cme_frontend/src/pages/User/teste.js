import React from "react";
import MaterialService from "../../services/MaterialService";
import Table from "../../components/Table/Table";

const Material = () => {
  const formFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'material_type', label: 'Tipo de material', type: 'text', required: true },
    { name: 'expiration_date', label: 'Data de expiração', type: 'date' }
  ];

  const getUserType = (type) => {
    const typeMapping = {
      'T': 'Técnico',
      'N': 'Enfermagem',
      'A': 'Administrativo'
    };
    return typeMapping[type] || 'Não especificado';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'material_type', label: 'Tipo do material' },
    { key: 'expiration_date', label: 'Data de expiração' },
    { key: 'serial', label: 'Serial' }
  ];

  const details = {
    name: 'Gerenciar Material'

  }

  const mapRowData = (item, key) => key === 'type' ? getUserType(item.type) : item[key];

  return (
    <div>
      <Table
        details={details}
        service={MaterialService}
        columns={columns}
        mapRowData={mapRowData}
        formFields={formFields}
      />
    </div>
  );
};

export default Material;
