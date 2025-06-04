import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../css/AdminPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Request {
  id: number;
  type: string;
  address: string;
  description: string;
  requesterName: string;
  cpfOrCnpj: string;
  status: string;
}

const AdminPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = (id: number, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.patch(`/requests/${id}/status`, {
        status: statusUpdates[id],
      });
      alert('Status atualizado com sucesso!');
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: statusUpdates[id] } : req
        )
      );
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      alert('Erro ao atualizar status.');
    }
  };

    const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta solicitação?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Solicitação deletada com sucesso!');
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      alert('Erro ao deletar solicitação.');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Painel Administrativo</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Endereço</th>
            <th>Descrição</th>
            <th>Solicitante</th>
            <th>CPF/CNPJ</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.type}</td>
              <td>{req.address}</td>
              <td>{req.description}</td>
              <td>{req.requesterName}</td>
              <td>{req.cpfOrCnpj}</td>
              <td>
                <select
                  value={statusUpdates[req.id] || req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Concluído</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleUpdate(req.id)}
                  disabled={!statusUpdates[req.id] || statusUpdates[req.id] === req.status} 
                >
                  <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: '6px' }} />

                  Atualizar
                </button>
                  <button
                  className="admin-button delete-button"
                  onClick={() => handleDelete(req.id)}
                >
                   <FontAwesomeIcon icon={faTrash} style={{ marginRight: '6px' }} />
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
