import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Input, Button, Label, ErrorMessage } from '../atoms';

const RegisterForm = ({ 
  onRegister,
  loading = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isDark, colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const errors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar correo electrónico
    if (!formData.email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Borrar error del campo al modificar
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Borrar error general
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // función de registro
      if (onRegister) {
        await onRegister({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
      }

      // Mostrar mensaje de éxito
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
      
      // Redirigir a login después de un retraso
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className={`w-full space-y-8 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header Editorial */}
        <div className="text-center mb-8">
          <div 
            className={`inline-flex items-center justify-center w-20 h-20 mb-6 transition-all duration-300 ${isDark ? 'shadow-xl' : ''}`}
            style={{
              background: colors.surface,
              border: `2px solid ${colors.primary}`,
              boxShadow: isDark ? `0 0 20px ${colors.primary}30` : 'none'
            }}
          >
            <UserPlus 
              className={`w-10 h-10 transition-all duration-300 ${isDark ? 'drop-shadow-lg' : ''}`} 
              style={{ 
                color: colors.primary,
                filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}60)` : 'none'
              }} 
            />
          </div>
          <h2 
            className={`text-3xl font-light tracking-wider mb-2 transition-all duration-300 ${isDark ? 'drop-shadow-lg' : ''}`}
            style={{ 
              color: colors.text,
              textShadow: isDark ? `0 0 12px ${colors.primary}40` : 'none'
            }}
          >
            Crear Cuenta
          </h2>
          <p 
            className="text-sm font-medium tracking-wider uppercase transition-colors duration-300"
            style={{ color: colors.textMuted }}
          >
            Completa el Formulario
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div 
            className={`border-l-4 px-4 py-3 transition-all duration-300 ${isDark ? 'shadow-lg' : ''}`}
            style={{
              background: `${colors.surface}90`,
              borderColor: colors.primary,
              backdropFilter: 'blur(10px)',
              boxShadow: isDark ? `0 0 15px ${colors.primary}20` : 'none'
            }}
          >
            <ErrorMessage type="success" size="md" showIcon>
              {success}
            </ErrorMessage>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className={`border-l-4 px-4 py-3 transition-all duration-300 ${isDark ? 'shadow-lg' : ''}`}
            style={{
              background: `${colors.surface}90`,
              borderColor: colors.error,
              backdropFilter: 'blur(10px)',
              boxShadow: isDark ? `0 0 15px ${colors.error}20` : 'none'
            }}
          >
            <ErrorMessage type="error" size="md" showIcon>
              {error}
            </ErrorMessage>
          </div>
        )}

        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Nombre Completo
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tu Nombre"
              hasError={!!fieldErrors.name}
              ariaDescribedBy={fieldErrors.name ? "name-error" : undefined}
              icon={<User size={18} />}
            />
            <ErrorMessage id="name-error" type="error">
              {fieldErrors.name}
            </ErrorMessage>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Correo Electrónico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              placeholder="usuario@ejemplo.com"
              hasError={!!fieldErrors.email}
              ariaDescribedBy={fieldErrors.email ? "email-error" : undefined}
              icon={<Mail size={18} />}
            />
            <ErrorMessage id="email-error" type="error">
              {fieldErrors.email}
            </ErrorMessage>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" required>
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={!!fieldErrors.password}
              ariaDescribedBy={fieldErrors.password ? "password-error" : undefined}
              icon={<Lock size={18} />}
            />
            <ErrorMessage id="password-error" type="error">
              {fieldErrors.password}
            </ErrorMessage>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={!!fieldErrors.confirmPassword}
              ariaDescribedBy={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
              icon={<Lock size={18} />}
            />
            <ErrorMessage id="confirm-password-error" type="error">
              {fieldErrors.confirmPassword}
            </ErrorMessage>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
          >
            {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
          </Button>
        </div>

        {/* Login Link */}
        <div className="pt-7 text-center">
          <p className="text-xs tracking-wider transition-colors duration-300" style={{ color: colors.textMuted }}>
            Ya tienes cuenta?{' '}
            <Link 
              to="/login"
              className="font-medium tracking-wider transition-all duration-300"
              style={{ 
                color: colors.text,
                textDecoration: 'none',
                borderBottom: `1px solid ${colors.textMuted}`
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
                e.target.style.borderBottomColor = colors.primary;
                if (isDark) {
                  e.target.style.textShadow = `0 0 8px ${colors.primary}60`;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.text;
                e.target.style.borderBottomColor = colors.textMuted;
                e.target.style.textShadow = 'none';
              }}
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </form>

      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 w-20 h-20 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}>
        <div 
          className="w-full h-full border border-dashed transition-all duration-500"
          style={{ 
            borderColor: colors.primary,
            boxShadow: isDark ? `0 0 15px ${colors.primary}20` : 'none'
          }}
        ></div>
      </div>
      <div className={`absolute bottom-0 left-0 w-12 h-12 transition-all duration-500 ${isDark ? 'opacity-50' : 'opacity-30'}`}>
        <div 
          className="w-1 h-1 absolute top-0 left-0 transition-all duration-500"
          style={{ 
            background: colors.text,
            boxShadow: isDark ? `0 0 4px ${colors.primary}60` : 'none'
          }}
        ></div>
        <div 
          className="w-1 h-1 absolute top-0 right-0 transition-all duration-500"
          style={{ 
            background: colors.text,
            boxShadow: isDark ? `0 0 4px ${colors.primary}60` : 'none'
          }}
        ></div>
        <div 
          className="w-1 h-1 absolute bottom-0 left-0 transition-all duration-500"
          style={{ 
            background: colors.text,
            boxShadow: isDark ? `0 0 4px ${colors.primary}60` : 'none'
          }}
        ></div>
        <div 
          className="w-1 h-1 absolute bottom-0 right-0 transition-all duration-500"
          style={{ 
            background: colors.text,
            boxShadow: isDark ? `0 0 4px ${colors.primary}60` : 'none'
          }}
        ></div>
      </div>
    </div>
  );
};

RegisterForm.propTypes = {
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default RegisterForm;