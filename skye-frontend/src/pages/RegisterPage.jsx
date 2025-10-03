import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/templates';
import { RegisterForm } from '../components/organisms';
import { authAPI } from '../services/api';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    setLoading(true);
    
    try {
      // Llamada real a la API de Laravel
      const response = await authAPI.register(
        userData.name,
        userData.email,
        userData.password,
        userData.confirmPassword
      );

      if (response.success) {
        // NO guardamos el token automáticamente para mejor UX
        // El usuario debe hacer login después de la confirmación
        
        // Redirigir a página de confirmación con datos del usuario
        navigate('/user-created', { 
          state: { 
            user: response.user 
          } 
        });
        
        return response;
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }

    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de error
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Errores de validación de Laravel
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0][0];
        throw new Error(firstError);
      } else if (error.response?.status === 422) {
        throw new Error('Datos de registro inválidos. Verifique la información.');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        throw new Error('Error de conexión. Verifique su conexión a internet.');
      } else {
        throw new Error(error.message || 'Error al registrar usuario. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <RegisterForm
        onRegister={handleRegister}
        loading={loading}
      />
    </AuthLayout>
  );
};

export default RegisterPage;