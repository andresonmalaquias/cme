import React from "react";
import UserService from "../../services/UserService";
import Table from "../../components/Table/Table";

const User = () => {
  const formFields = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'password', label: 'Senha', type: 'password' },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select',
      required: true,
      defaultValue: 'A',
      options: [
        { value: '', label: 'Selecione...' },
        { value: 'T', label: 'Técnico' },
        { value: 'N', label: 'Enfermagem' },
        { value: 'A', label: 'Administrativo' }
      ]
    }
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
    { key: 'username', label: 'Username' },
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' }
  ];

  const extraSettings = {
    manager: true,
    name: 'Gerenciar Usuário',
  };

  const mapRowData = (item, key) => key === 'type' ? getUserType(item.type) : item[key];

  return (
    <div>
      <Table
        extraSettings={extraSettings}
        service={UserService}
        columns={columns}
        mapRowData={mapRowData}
        formFields={formFields}
      />
    </div>
  );
};

export default User;
