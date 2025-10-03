import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Input, Button, Label, ErrorMessage } from '../atoms';

/**
 * @fileoverview Formulario de inicio de sesión para CatWare Systems
 * Implementa validación de campos, manejo de errores y accesibilidad completa
 * Soporta modo oscuro gótico y transiciones suaves
 */

/**
 * @component LoginForm
 * @description Formulario de inicio de sesión con validación de campos, manejo de errores
 * y soporte completo para accesibilidad. Implementa el sistema de temas con paleta gótica
 * y efectos visuales suaves. Incluye validación en tiempo real y mensajes de error descriptivos.
 * 
 * Características:
 * - Validación de email con formato correcto
 * - Validación de contraseña con longitud mínima
 * - Mensajes de error accesibles con ARIA
 * - Soporte completo para lectores de pantalla
 * - Navegación por teclado optimizada
 * - Efectos visuales gothic con transiciones suaves
 * - Integración completa con sistema de temas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Callback ejecutado al enviar el formulario con credenciales válidas
 * @param {boolean} [props.loading=false] - Estado de carga del formulario
 * @param {string} [props.error] - Mensaje de error general del formulario
 * @param {string} [props.className=''] - Clases CSS adicionales para el contenedor
 * @returns {JSX.Element} Elemento JSX del formulario de login
 * 
 * @example
 * <LoginForm 
 *   onSubmit={(credentials) => console.log('Login:', credentials)}
 *   loading={false}
 *   error=""
 *   className="custom-styles"
 * />
 */
const LoginForm = ({ 
  onSubmit,
  loading = false,
  error,
  className = ''
}) => {
  const { colors, isDark } = useTheme();
  
  // Estado del formulario con campos de email y contraseña
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para errores de validación por campo
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Maneja los cambios en los campos del formulario
   * Actualiza el estado del formulario y limpia errores de validación
   * 
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Valida todos los campos del formulario
   * Verifica formato de email y longitud de contraseña
   * 
   * @returns {Object} Objeto con errores de validación por campo
   */
  const validate = () => {
    const errors = {};

    // Validación del email
    if (!formData.email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido';
    }

    // Validación de la contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return errors;
  };

  /**
   * Maneja el envío del formulario
   * Previene el comportamiento por defecto, valida campos y ejecuta callback
   * 
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Limpiar errores y enviar datos
    setFieldErrors({});
    onSubmit(formData);
  };

  return (
    <div className={`w-full space-y-8 ${className}`}>
      
      {/* Visualización de errores generales del formulario */}
      {error && (
        <div 
          className="border-l-4 px-4 py-3 transition-all duration-300"
          style={{
            background: isDark ? `${colors.surface}90` : `${colors.white}80`,
            borderColor: colors.error,
            backdropFilter: 'blur(10px)',
            boxShadow: isDark ? `0 0 20px ${colors.error}30` : 'none'
          }}
        >
          <ErrorMessage id="form-error" type="error" size="md" showIcon>
            {error}
          </ErrorMessage>
        </div>
      )}

      {/* Formulario principal con validación y accesibilidad */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Campo de correo electrónico */}
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

        {/* Campo de contraseña */}
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
            autoComplete="current-password"
            placeholder="••••••••"
            hasError={!!fieldErrors.password}
            ariaDescribedBy={fieldErrors.password ? "password-error" : undefined}
            icon={<Lock size={18} />}
          />
          <ErrorMessage id="password-error" type="error">
            {fieldErrors.password}
          </ErrorMessage>
        </div>

        {/* Botón de envío del formulario */}
        <div className="pt-8">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
            ariaDescribedBy={loading ? "loading-status" : undefined}
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </Button>
        </div>

        {/* Enlace a registro */}
        <div className="pt-6 text-center">
          <p className="text-xs tracking-wider" style={{ color: colors.mediumGray }}>
            ¿No tienes usuario?{' '}
            <Link 
              to="/register"
              className="font-medium tracking-wider transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                color: colors.darkGray,
                textDecoration: 'none',
                borderBottom: `1px solid ${colors.mediumGray}`,
                focusRingColor: colors.primary
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
                e.target.style.borderBottomColor = colors.primary;
                if (isDark) {
                  e.target.style.textShadow = `0 0 8px ${colors.primary}60`;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.darkGray;
                e.target.style.borderBottomColor = colors.mediumGray;
                e.target.style.textShadow = 'none';
              }}
            >
              Regístrate!
            </Link>
          </p>
        </div>
      </form>

      {/* Elementos decorativos góticos */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20" aria-hidden="true">
        <div 
          className="w-full h-full border border-dashed"
          style={{ borderColor: colors.gold }}
        ></div>
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 opacity-30" aria-hidden="true">
        <div 
          className="w-2 h-2 absolute top-0 left-0"
          style={{ background: colors.darkGray }}
        ></div>
        <div 
          className="w-2 h-2 absolute top-0 right-0"
          style={{ background: colors.darkGray }}
        ></div>
        <div 
          className="w-2 h-2 absolute bottom-0 left-0"
          style={{ background: colors.darkGray }}
        ></div>
        <div 
          className="w-2 h-2 absolute bottom-0 right-0"
          style={{ background: colors.darkGray }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
LoginForm.propTypes = {
  /** Función callback ejecutada cuando el formulario se envía con datos válidos */
  onSubmit: PropTypes.func.isRequired,
  /** Estado de carga que deshabilita el formulario y muestra indicador */
  loading: PropTypes.bool,
  /** Mensaje de error general del formulario para mostrar al usuario */
  error: PropTypes.string,
  /** Clases CSS adicionales para personalización del contenedor */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
LoginForm.defaultProps = {
  loading: false,
  error: '',
  className: '',
};

export default LoginForm;