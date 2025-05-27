import React from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import './StatusCards.css';

const StatusCards = ({ data, selectedStatus, onStatusChange }) => {
  const statusCounts = {
    all: data.length,
    done: data.filter(f => f.status === 'done').length,
    working: data.filter(f => f.status === 'working').length,
    pending: data.filter(f => f.status === 'pending').length
  };

  const statusConfig = {
    all: { label: 'Total', icon: <FiTrendingUp />, color: 'var(--primary-color)' },
    done: { label: 'Concluído', icon: <FiCheckCircle />, color: 'var(--status-completed)' },
    working: { label: 'Em Progresso', icon: <FiClock />, color: 'var(--status-progress)' },
    pending: { label: 'Pendente', icon: <FiAlertCircle />, color: 'var(--status-pending)' }
  };

  return (
    <div className="status-cards-container">
      {Object.entries(statusCounts).map(([key, count]) => (
        <div
          key={key}
          className={`status-card ${selectedStatus === key ? 'active' : ''}`}
          onClick={() => onStatusChange(key)}
          style={{
            '--status-color': statusConfig[key].color
          }}
        >
          <div className="status-icon">
            {statusConfig[key].icon}
          </div>
          <div className="status-info">
            <div className="status-count">{count}</div>
            <div className="status-label">{statusConfig[key].label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;