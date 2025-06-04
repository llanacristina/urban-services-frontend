import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';
import '../css/LoginPage.css';

const loginSchema = z.object({
  username: z.string().nonempty('O administrador é obrigatório'),
  password: z.string().nonempty('A senha é obrigatória'),
});

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const validation = loginSchema.safeParse({ username, password });

    if (!validation.success) {
      const fieldErrors = validation.error.format();
      setErrors({
        username: fieldErrors.username?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }

    try {
      const response = await api.post('http://localhost:3000/auth/login', { username, password });

      const { access_token, role } = response.data;

      if (role !== 'admin') {
        alert('Apenas administradores podem acessar.');
        return;
      }

     login(access_token, role);
     localStorage.setItem('token', access_token);
     localStorage.setItem('role', role);
      navigate('/admin');

    } catch (error) {
      alert('Credenciais inválidas');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <input
        className="login-input"
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {errors.username && <p className="error-text">{errors.username}</p>}

      <input
        className="login-input"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {errors.password && <p className="error-text">{errors.password}</p>}

      <button className="login-button" onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
};

export default LoginPage;
