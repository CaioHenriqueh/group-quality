import React, { useState } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiChevronDown, FiSearch } from 'react-icons/fi';
import StatusCards from '../statusCard/StatusCards';
import './FunctionalitiesTable.css';

const FunctionalitiesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  const functionalities = [
    { id: 'LOG-001', name: 'Login', modifiedDate: '15/10/2023 14:30', status: 'done', priority: 'high', tests: 12 },
    { id: 'CAD-002', name: 'Cadastro', modifiedDate: '18/10/2023 09:15', status: 'working', priority: 'critical', tests: 8 },
    { id: 'PROJ-003', name: 'Listagem de Projetos', modifiedDate: '20/10/2023 16:45', status: 'done', priority: 'medium', tests: 15 },
    { id: 'MOD-004', name: 'Modal de Adição', modifiedDate: '22/10/2023 11:20', status: 'pending', priority: 'high', tests: 6 },
  ];

  const filteredData = functionalities.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { label: 'CRÍTICO', color: 'var(--priority-critical)' },
      high: { label: 'ALTO', color: 'var(--priority-high)' },
      medium: { label: 'MÉDIO', color: 'var(--priority-medium)' }
    };
    return configs[priority];
  };

  return (
    <div className="functionalities-container">
      <div className="table-header">
        <h1>Planejamento de Testes</h1>
        <div className="search-add-container">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar funcionalidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-button">
            <FiPlus /> Nova Funcionalidade
          </button>
        </div>
      </div>

      <StatusCards 
        data={functionalities} 
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <div className="table-wrapper">
        <table className="hardcore-table">
          <thead>
            <tr>
              <th className="column-id">ID <FiChevronDown /></th>
              <th className="column-name">Funcionalidade</th>
              <th className="column-date">Modificação <FiChevronDown /></th>
              <th className="column-status">Status</th>
              <th className="column-priority">Prioridade</th>
              <th className="column-tests">Testes</th>
              <th className="column-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr 
                key={item.id}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={hoveredRow === index ? 'row-hovered' : ''}
              >
                <td className="cell-id">{item.id}</td>
                <td className="cell-name">
                  <div className="name-wrapper">
                    <div className="name">{item.name}</div>
                    <div className="subtext">Funcionalidade principal</div>
                  </div>
                </td>
                <td className="cell-date">{item.modifiedDate}</td>
                <td className="cell-status">
                  <div className={`status-badge ${item.status}`}>
                    {item.status === 'done' && 'Concluído'}
                    {item.status === 'working' && 'Em Progresso'}
                    {item.status === 'pending' && 'Pendente'}
                  </div>
                </td>
                <td className="cell-priority">
                  <div 
                    className="priority-badge"
                    style={{ 
                      color: getPriorityConfig(item.priority).color,
                      borderColor: getPriorityConfig(item.priority).color
                    }}
                  >
                    {getPriorityConfig(item.priority).label}
                  </div>
                </td>
                <td className="cell-tests">
                  <div className="tests-count">
                    {item.tests}
                  </div>
                </td>
                <td className="cell-actions">
                  <button className="action-btn edit">
                    <FiEdit3 />
                  </button>
                  <button className="action-btn delete">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <FiSearch className="empty-icon" />
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionalitiesTable;