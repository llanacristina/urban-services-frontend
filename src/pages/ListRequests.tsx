import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../css/ListRequests.css';

interface Request {
  id: number;
  type: string;
  address: string;
  description: string;
  requesterName: string;
  cpfOrCnpj: string;
  status: string;
}

const ListRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('http://localhost:3000/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="list-container">
      <h2 className="list-title">Lista de Solicitações</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Endereço</th>
            <th>Descrição</th>
            <th>Solicitante</th>
            <th>CPF/CNPJ</th>
            <th>Status</th>
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
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRequests;
