import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente ErrorMessage atómico para CatWare Systems
 * Mensaje reutilizable para errores, éxito, información y advertencias
 * Extrae la lógica común de mensajes de LoginForm y RegisterForm
 */

/**
 * @component ErrorMessage
 * @description Componente de mensaje reutilizable con soporte para múltiples tipos,
 * iconos visuales y accesibilidad completa. Implementa el sistema de temas
 * con efectos visuales góticos.
 * 
 * Características:
 * - Tipos: error, success, warning, info
 * - Iconos automáticos según el tipo
 * - Soporte completo para temas claro/oscuro
 * - Accesibilidad WCAG 2.1 AA con ARIA
 * - Animaciones de entrada suaves
 * - Efectos visuales góticos en modo oscuro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del mensaje
 * @param {string} [props.type='error'] - Tipo de mensaje (error, success, warning, info)
 * @param {string} [props.id] - ID único para accesibilidad
 * @param {boolean} [props.showIcon=true] - Mostrar icono automático
 * @param {string} [props.size='md'] - Tamaño del mensaje (sm, md, lg)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element|null} Elemento JSX del mensaje o null si no hay contenido
 * 
 * @example
 * <ErrorMessage type="error" id="email-error">
 *   El correo electrónico es requerido
 * </ErrorMessage>
 * 
 * <ErrorMessage type="success">
 *   ¡Cuenta creada exitosamente!
 * </ErrorMessage>
 */
const ErrorMessage = ({
  children,
  type = 'error',
  id,
  showIcon = true,
  size = 'md',
  className = '',
  ...props
}) => {
  const { colors, isDark } = useTheme();

  // No renderizar si no hay contenido
  if (!children) return null;

  /**
   * Obtiene el icono correspondiente según el tipo de mensaje
   * 
   * @returns {React.Component|null} Componente de icono o null
   */
  const getIcon = () => {
    if (!showIcon) return null;

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
    
    switch (type) {
      case 'error':
        return <AlertCircle size={iconSize} aria-hidden="true" />;
      case 'success':
        return <CheckCircle size={iconSize} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={iconSize} aria-hidden="true" />;
      case 'info':
        return <Info size={iconSize} aria-hidden="true" />;
      default:
        return <AlertCircle size={iconSize} aria-hidden="true" />;
    }
  };

  /**
   * Obtiene el color según el tipo de mensaje
   * 
   * @returns {string} Color hex para el tipo de mensaje
   */
  const getColor = () => {
    switch (type) {
      case 'error':
        return colors.error;
      case 'success':
        return colors.primary; // Verde del sistema
      case 'warning':
        return colors.gold; // Dorado del sistema
      case 'info':
        return colors.mediumGray;
      default:
        return colors.error;
    }
  };

  /**
   * Obtiene los estilos del mensaje según el tipo y tamaño
   * 
   * @returns {Object} Estilos CSS para el mensaje
   */
  const getMessageStyles = () => {
    const color = getColor();
    
    return {
      color: color,
      fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
      fontWeight: '500',
      textShadow: isDark && type !== 'info' ? `0 0 8px ${color}30` : 'none',
      transition: 'all 0.3s ease',
    };
  };

  /**
   * Obtiene el rol ARIA según el tipo de mensaje
   * 
   * @returns {string} Rol ARIA apropiado
   */
  const getAriaRole = () => {
    switch (type) {
      case 'error':
      case 'warning':
        return 'alert';
      case 'success':
        return 'status';
      case 'info':
        return 'status';
      default:
        return 'alert';
    }
  };

  /**
   * Obtiene el nivel de aria-live según el tipo
   * 
   * @returns {string} Nivel de aria-live
   */
  const getAriaLive = () => {
    switch (type) {
      case 'error':
      case 'warning':
        return 'assertive';
      case 'success':
      case 'info':
        return 'polite';
      default:
        return 'assertive';
    }
  };

  return (
    <div
      id={id}
      role={getAriaRole()}
      aria-live={getAriaLive()}
      className={`flex items-start space-x-2 mt-2 animate-in slide-in-from-top-1 duration-300 ${className}`}
      style={getMessageStyles()}
      {...props}
    >
      {/* Icono del mensaje */}
      {getIcon() && (
        <div 
          className="flex-shrink-0 mt-0.5"
          style={{ color: getColor() }}
        >
          {getIcon()}
        </div>
      )}
      
      {/* Contenido del mensaje */}
      <div className="flex-1 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
ErrorMessage.propTypes = {
  /** Contenido del mensaje (texto o elementos React) */
  children: PropTypes.node,
  /** Tipo de mensaje que determina color e icono */
  type: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  /** ID único para accesibilidad y vinculación con inputs */
  id: PropTypes.string,
  /** Si debe mostrar el icono automático */
  showIcon: PropTypes.bool,
  /** Tamaño del mensaje que afecta font-size e icono */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Clases CSS adicionales para personalización */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
ErrorMessage.defaultProps = {
  type: 'error',
  showIcon: true,
  size: 'md',
  className: '',
};

export default ErrorMessage;