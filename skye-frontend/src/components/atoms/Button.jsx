import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente Button atómico para CatWare Systems
 * Botón reutilizable con soporte completo para temas, estados y accesibilidad
 * Extrae la lógica común de botones de LoginForm, RegisterForm y UserTable
 */

/**
 * @component Button
 * @description Componente de botón reutilizable con soporte para múltiples variantes,
 * estados de carga, efectos visuales góticos y accesibilidad completa.
 * Implementa el sistema de temas con transiciones suaves.
 * 
 * Características:
 * - Variantes: primary, secondary, danger, ghost
 * - Estados: normal, loading, disabled
 * - Efectos hover y focus góticos
 * - Soporte completo para temas claro/oscuro
 * - Accesibilidad WCAG 2.1 AA
 * - Animaciones y transiciones suaves
 * - Indicador de carga integrado
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} [props.variant='primary'] - Variante visual del botón
 * @param {string} [props.type='button'] - Tipo de botón HTML
 * @param {Function} [props.onClick] - Callback para evento click
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.fullWidth=false] - Ocupa todo el ancho disponible
 * @param {string} [props.size='md'] - Tamaño del botón (sm, md, lg)
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el botón
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del botón
 * 
 * @example
 * <Button 
 *   variant="primary" 
 *   loading={isLoading} 
 *   onClick={handleSubmit}
 *   fullWidth
 * >
 *   Iniciar Sesión
 * </Button>
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  ariaDescribedBy,
  className = '',
  ...props
}) => {
  const { colors, isDark } = useTheme();

  // Determinar si el botón está inactivo
  const isInactive = disabled || loading;

  /**
   * Obtiene los estilos base según la variante del botón
   * Aplica colores del sistema de temas dinámicamente
   * 
   * @returns {Object} Objeto con estilos CSS para el botón
   */
  const getBaseStyles = () => {
    const baseStyle = {
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
      padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 40px' : '12px 32px',
      border: '2px solid',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      cursor: isInactive ? 'not-allowed' : 'pointer',
      opacity: isInactive ? 0.6 : 1,
      transform: isInactive ? 'none' : 'scale(1)',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: isInactive ? colors.surface : (isDark ? colors.surface : colors.white),
          borderColor: colors.primary,
          color: colors.darkGray,
          boxShadow: isDark ? `0 0 20px ${colors.primary}20` : `0 4px 12px ${colors.shadow}`,
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          background: 'transparent',
          borderColor: colors.mediumGray,
          color: colors.darkGray,
          boxShadow: 'none',
        };
      
      case 'danger':
        return {
          ...baseStyle,
          background: isInactive ? colors.surface : (isDark ? colors.surface : colors.white),
          borderColor: colors.error,
          color: colors.error,
          boxShadow: isDark ? `0 0 20px ${colors.error}20` : `0 4px 12px ${colors.shadow}`,
        };
      
      case 'ghost':
        return {
          ...baseStyle,
          background: 'transparent',
          border: 'none',
          color: colors.darkGray,
          boxShadow: 'none',
          padding: size === 'sm' ? '4px 8px' : size === 'lg' ? '8px 16px' : '6px 12px',
        };
      
      default:
        return baseStyle;
    }
  };

  // Removemos los handlers de mouse para evitar bugs de acumulación

  /**
   * Maneja el evento click ejecutando el callback si no está inactivo
   * 
   * @param {Event} e - Evento de click
   */
  const handleClick = (e) => {
    if (isInactive) {
      e.preventDefault();
      return;
    }
    
    // Efecto de click
    e.target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      if (e.target) {
        e.target.style.transform = 'scale(1)';
      }
    }, 150);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isInactive}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`
        ${fullWidth ? 'w-full' : ''} 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        transition-all duration-300 ease-in-out
        hover:opacity-90
        ${variant === 'danger' ? 'hover:brightness-110' : ''}
        ${className}
      `}
      style={{
        ...getBaseStyles(),
        focusRingColor: colors.primary,
      }}
      {...props}
    >
      {loading ? (
        // Estado de carga con spinner
        <div className="flex items-center justify-center space-x-3">
          <div 
            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: colors.mediumGray }}
            aria-hidden="true"
          ></div>
          <span>{children}</span>
        </div>
      ) : (
        // Contenido normal
        <span className="relative z-10">
          {children}
        </span>
      )}
    </button>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
Button.propTypes = {
  /** Contenido del botón (texto o elementos React) */
  children: PropTypes.node.isRequired,
  /** Variante visual del botón que determina colores y estilos */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  /** Tipo de botón HTML para comportamiento en formularios */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Función callback ejecutada al hacer click */
  onClick: PropTypes.func,
  /** Estado deshabilitado que previene interacción */
  disabled: PropTypes.bool,
  /** Estado de carga que muestra spinner y previene clicks */
  loading: PropTypes.bool,
  /** Si debe ocupar todo el ancho del contenedor */
  fullWidth: PropTypes.bool,
  /** Tamaño del botón que afecta padding y font-size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** ID del elemento que describe el botón para accesibilidad */
  ariaDescribedBy: PropTypes.string,
  /** Clases CSS adicionales para personalización */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
Button.defaultProps = {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  size: 'md',
  className: '',
};

export default Button;