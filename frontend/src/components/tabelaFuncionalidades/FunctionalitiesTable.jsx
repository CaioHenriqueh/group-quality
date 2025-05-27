import React, { useState, useEffect } from 'react';
import {
  FiEdit2, FiTrash, FiPlus, FiChevronDown, FiSearch,
  FiX, FiCheck, FiChevronLeft, FiChevronRight,
  FiFilter, FiSave, FiEye, FiPieChart, FiBarChart2
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import StatusCards from '../statusCard/StatusCards';
import ifoodLogo from "../../assets/image.png";
import './FunctionalitiesTable.css';

// Charting libraries
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const FunctionalitiesTable = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Data states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'modifiedDate', direction: 'desc' });
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  // Modal states
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data
  const [functionalities, setFunctionalities] = useState([
    { id: 1, name: 'Login', modifiedDate: '15/10/2023', status: 'done', tests: 12, owner: 'Carlos Silva', priority: 'high' },
    { id: 2, name: 'Cadastro de Usuários', modifiedDate: '18/10/2023', status: 'working', tests: 8, owner: 'Ana Santos', priority: 'medium' },
    { id: 3, name: 'Listagem de Projetos', modifiedDate: '20/10/2023', status: 'done', tests: 15, owner: 'Pedro Costa', priority: 'low' },
    { id: 4, name: 'Modal de Adição', modifiedDate: '22/10/2023', status: 'pending', tests: 6, owner: 'Mariana Oliveira', priority: 'high' },
    { id: 5, name: 'Dashboard Analytics', modifiedDate: '25/10/2023', status: 'done', tests: 18, owner: 'Ricardo Fernandes', priority: 'high' },
    { id: 6, name: 'Exportar Relatórios', modifiedDate: '28/10/2023', status: 'working', tests: 9, owner: 'Juliana Pereira', priority: 'medium' },
    { id: 7, name: 'Importar Dados', modifiedDate: '30/10/2023', status: 'pending', tests: 5, owner: 'Lucas Mendes', priority: 'low' },
    { id: 8, name: 'Configurações', modifiedDate: '02/11/2023', status: 'done', tests: 11, owner: 'Fernanda Lima', priority: 'medium' },
  ]);

  // Unique owners for filter
  const uniqueOwners = [...new Set(functionalities.map(item => item.owner))];

  // Chart data
  const statusData = [
    { name: 'Concluído', value: functionalities.filter(f => f.status === 'done').length, color: '#11B45C' },
    { name: 'Em Progresso', value: functionalities.filter(f => f.status === 'working').length, color: '#FF9900' },
    { name: 'Pendente', value: functionalities.filter(f => f.status === 'pending').length, color: '#EE421D' }
  ];

  // Sort function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sorting logic
  const sortedData = [...functionalities].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesOwners = selectedOwners.length === 0 || selectedOwners.includes(item.owner);
    return matchesSearch && matchesStatus && matchesOwners;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (functionalities.filter(f => f.status === 'done').length / functionalities.length) * 100
  );

  // Toggle owner selection
  const toggleOwner = (owner) => {
    setSelectedOwners(prev =>
      prev.includes(owner)
        ? prev.filter(o => o !== owner)
        : [...prev, owner]
    );
    setCurrentPage(1);
  };

  // Apply dark/light theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`dsm-table-container ${darkMode ? 'dark' : ''}`}>
      {/* Product Header */}
      <div className="product-header">
        <div className="product-card">
          <div className="product-logo-container">
            <img src={ifoodLogo} alt="iFood Logo" />
            <div className="product-badge">PRO</div>
          </div>
          <div className="product-info">
            <h2>iFood</h2>
            <p>Plataforma de delivery e gestão de pedidos</p>
            <div className="product-meta">
              <span className="product-version">v4.2.1</span>
              <span className="product-stats">
                <span className="stat-item">
                  <FiPieChart className="stat-icon" />
                  {functionalities.length} funcionalidades
                </span>
                <span className="stat-item">
                  <FiCheck className="stat-icon" />
                  {completionPercentage}% completo
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="view-toggle" onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}>
            {viewMode === 'table' ? <FiBarChart2 /> : <FiEye />}
            {viewMode === 'table' ? 'Visualização Gráfica' : 'Visualização em Tabela'}
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-controls">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar funcionalidades..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FiX />
              </button>
            )}
          </div>

          <button
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            Filtros
            {selectedOwners.length > 0 && (
              <span className="filter-badge">{selectedOwners.length}</span>
            )}
          </button>
        </div>

        <button className="add-button">
          <FiPlus />
          Nova Funcionalidade
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="filter-group">
              <h4>Responsáveis</h4>
              <div className="owner-filters">
                {uniqueOwners.map(owner => (
                  <button
                    key={owner}
                    className={`owner-tag ${selectedOwners.includes(owner) ? 'selected' : ''}`}
                    onClick={() => toggleOwner(owner)}
                  >
                    {owner}
                    {selectedOwners.includes(owner) && <FiCheck />}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button
                className="clear-filters"
                onClick={() => {
                  setSelectedOwners([]);
                  setSelectedStatus('all');
                }}
              >
                Limpar Filtros
              </button>
              <button
                className="save-view"
                onClick={() => alert('Visualização salva!')}
              >
                <FiSave />
                Salvar Visualização
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Cards */}
      <StatusCards
        data={functionalities}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
      />

      {/* Main Content */}
      {viewMode === 'table' ? (
        <div className="table-content">
          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    <div className="th-content">
                      Nome
                      <FiChevronDown className={`sort-icon ${sortConfig.key === 'name' ? 'active' : ''} ${sortConfig.direction}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('modifiedDate')}>
                    <div className="th-content">
                      Última Atualização
                      <FiChevronDown className={`sort-icon ${sortConfig.key === 'modifiedDate' ? 'active' : ''} ${sortConfig.direction}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div className="th-content">
                      Status
                      <FiChevronDown className={`sort-icon ${sortConfig.key === 'status' ? 'active' : ''} ${sortConfig.direction}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('tests')}>
                    <div className="th-content">
                      Testes
                      <FiChevronDown className={`sort-icon ${sortConfig.key === 'tests' ? 'active' : ''} ${sortConfig.direction}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('owner')}>
                    <div className="th-content">
                      Responsável
                      <FiChevronDown className={`sort-icon ${sortConfig.key === 'owner' ? 'active' : ''} ${sortConfig.direction}`} />
                    </div>
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentItems.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="table-row"
                    >
                      <td>
                        <div className="functionality-name">
                          {item.name}
                          {item.priority === 'high' && <span className="priority-badge high">ALTA</span>}
                          {item.priority === 'medium' && <span className="priority-badge medium">MÉDIA</span>}
                        </div>
                      </td>
                      <td>{item.modifiedDate}</td>
                      <td>
                        <div className={`status-badge ${item.status}`}>
                          {item.status === 'done' && 'Concluído'}
                          {item.status === 'working' && 'Em Progresso'}
                          {item.status === 'pending' && 'Pendente'}
                        </div>
                      </td>
                      <td>
                        <div className="test-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${Math.min(100, (item.tests / 20) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="test-count">{item.tests}</span>
                        </div>
                      </td>
                      <td>
                        <div className="owner-cell">
                          <div className="owner-avatar">
                            {item.owner.charAt(0)}
                          </div>
                          {item.owner}
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="action-btn edit"
                          onClick={() => setEditingItem(item)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => setItemToDelete(item)}
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="empty-state">
                <FiSearch className="empty-icon" />
                <h3>Nenhuma funcionalidade encontrada</h3>
                <p>Experimente ajustar sua busca ou filtros</p>
                <button
                  className="reset-filters"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedOwners([]);
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredData.length > itemsPerPage && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="pagination-ellipsis">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                  onClick={() => goToPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button
                className="pagination-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="chart-view">
          <div className="chart-container">
            <h3>Status das Funcionalidades</h3>
            <div className="chart-row">
              <div className="chart-item">
                <PieChart width={300} height={300}>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              <div className="chart-item">
                <h4>Testes por Funcionalidade</h4>
                <BarChart
                  width={500}
                  height={300}
                  data={filteredData.slice(0, 8).sort((a, b) => b.tests - a.tests)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tests" fill="#4f54f5" />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="modal-overlay">
            <motion.div
              className="edit-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Editar Funcionalidade</h3>
                <button className="close-btn" onClick={() => setEditingItem(null)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    >
                      <option value="pending">Pendente</option>
                      <option value="working">Em Progresso</option>
                      <option value="done">Concluído</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Prioridade</label>
                    <select
                      value={editingItem.priority}
                      onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value })}
                    >
                      <option value="high">Alta</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Número de Testes</label>
                  <input
                    type="number"
                    value={editingItem.tests}
                    onChange={(e) => setEditingItem({ ...editingItem, tests: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Responsável</label>
                  <select
                    value={editingItem.owner}
                    onChange={(e) => setEditingItem({ ...editingItem, owner: e.target.value })}
                  >
                    {uniqueOwners.map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setEditingItem(null)}>
                  Cancelar
                </button>
                <button className="save-btn" onClick={() => handleSaveEdit(editingItem)}>
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="modal-overlay">
            <motion.div
              className="confirm-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Confirmar Exclusão</h3>
                <button className="close-btn" onClick={() => setItemToDelete(null)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir a funcionalidade <strong>"{itemToDelete.name}"</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setItemToDelete(null)}>
                  Cancelar
                </button>
                <button
                  className="delete-btn"
                  onClick={confirmDelete}
                >
                  <FiTrash /> Confirmar Exclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FunctionalitiesTable;