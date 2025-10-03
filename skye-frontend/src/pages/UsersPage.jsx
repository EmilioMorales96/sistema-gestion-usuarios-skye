import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTable, MainLayout } from '../components';
import { usersAPI, authAPI } from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load users data
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    
    try {
      // Llamada real a la API de Laravel
      const response = await usersAPI.getUsers();
      
      if (response.success) {
        setUsers(response.users);
      } else {
        console.error('Error en la respuesta de la API:', response.message);
        // Si hay error en la respuesta, mantener lista vacía
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      
      // Manejar diferentes tipos de error
      if (error.response?.status === 401) {
        // Token expirado o inválido, redirigir al login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        console.error('Error de conexión');
        // Podríamos mostrar un mensaje de error de conexión
      } else {
        console.error('Error desconocido al cargar usuarios');
      }
      
      // En caso de error, mantener lista vacía
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Llamar a la API de logout para invalidar el token en el servidor
      await authAPI.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
      // Aunque haya error en la API, procedemos con el logout local
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirigir al login
      navigate('/login');
    }
  };

  return (
    <MainLayout>
      <UserTable
        users={users}
        onLogout={handleLogout}
        loading={loading}
      />
    </MainLayout>
  );
};

export default UsersPage;