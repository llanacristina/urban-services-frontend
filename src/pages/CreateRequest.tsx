import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import '../css/CreateRequest.css';

const CreateRequest: React.FC = () => {
  const [form, setForm] = useState({
    type: '',
    address: '',
    description: '',
    requesterName: '',
    cpfOrCnpj: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpfOrCnpj') {
      const numericValue = value.replace(/\D/g, '');

      if (numericValue.length <= 11) {
        newValue = cpf.format(numericValue);
      } else {
        newValue = cnpj.format(numericValue);
      }
    }

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async () => {
    try {
      await api.post('http://localhost:3000/requests', form);
      alert('Solicitação enviada com sucesso!');
      setForm({ type: '', address: '', description: '', requesterName: '', cpfOrCnpj: '' });
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar solicitação.');
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">Nova Solicitação de Serviço</h2>

      <input
        name="type"
        placeholder="Tipo de serviço (ex: troca de lâmpada)"
        value={form.type}
        onChange={handleChange}
        className="create-input"
      />

      <input
        name="address"
        placeholder="Endereço"
        value={form.address}
        onChange={handleChange}
        className="create-input"
      />

      <textarea
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        className="create-textarea"
      />

      <input
        name="requesterName"
        placeholder="Seu nome"
        value={form.requesterName}
        onChange={handleChange}
        className="create-input"
      />

      <input
        name="cpfOrCnpj"
        placeholder="CPF ou CNPJ"
        value={form.cpfOrCnpj}
        onChange={handleChange}
        className="create-input"
        maxLength={18} 
      />

      <button onClick={handleSubmit} className="create-button">
        Enviar Solicitação
      </button>

      <button onClick={() => navigate('/list')} className="list-button">
        Ver Solicitações
      </button>
      
      <button onClick={() => navigate('/login')} className="login-button">
        Painel Administrativo
      </button>
    </div>
  );
};

export default CreateRequest;
