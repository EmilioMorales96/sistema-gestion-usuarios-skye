import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, AuthLayout } from '../components';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      // Llamada real a la API de Laravel
      const response = await authAPI.login(credentials.email, credentials.password);
      
      if (response.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        navigate('/users');
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de login:', err);
      
      // Manejar diferentes tipos de error
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Credenciales incorrectas');
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setError('Error de conexión. Verifique su conexión a internet.');
      } else {
        setError('Error al iniciar sesión. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Acceso al Sistema">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
      
      {/* Development helper */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
        <p className="text-sm text-blue-800">
          <strong>Desarrollo:</strong> Use admin@test.com / 123456 para probar
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;