import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente Label atómico para CatWare Systems
 * Label reutilizable con soporte para temas y accesibilidad
 * Extrae la lógica común de labels de LoginForm y RegisterForm
 */

/**
 * @component Label
 * @description Componente de label reutilizable con estilos consistentes,
 * soporte para temas dinámicos y accesibilidad completa.
 * Implementa el diseño gótico de CatWare Systems.
 * 
 * Características:
 * - Estilos consistentes con el sistema de temas
 * - Indicador visual para campos requeridos
 * - Soporte completo para accesibilidad
 * - Tipografía optimizada para legibilidad
 * - Variantes de tamaño y peso
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Texto del label
 * @param {string} props.htmlFor - ID del input asociado para accesibilidad
 * @param {boolean} [props.required=false] - Indica si el campo es requerido
 * @param {string} [props.size='md'] - Tamaño del label (sm, md, lg)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del label
 * 
 * @example
 * <Label htmlFor="email" required>
 *   Correo Electrónico
 * </Label>
 */
const Label = ({
  children,
  htmlFor,
  required = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const { colors } = useTheme();

  /**
   * Obtiene los estilos del label según el tamaño
   * 
   * @returns {Object} Estilos CSS para el label
   */
  const getLabelStyles = () => {
    const baseStyle = {
      color: colors.mediumGray,
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      transition: 'color 0.2s ease',
    };

    switch (size) {
      case 'sm':
        return {
          ...baseStyle,
          fontSize: '10px',
          marginBottom: '4px',
        };
      case 'lg':
        return {
          ...baseStyle,
          fontSize: '14px',
          marginBottom: '12px',
        };
      default: // md
        return {
          ...baseStyle,
          fontSize: '12px',
          marginBottom: '8px',
        };
    }
  };

  return (
    <label 
      htmlFor={htmlFor}
      className={`block ${className}`}
      style={getLabelStyles()}
      {...props}
    >
      {children}
      {/* Indicador visual para campos requeridos */}
      {required && (
        <span 
          className="ml-1"
          style={{ color: colors.error }}
          aria-label="campo requerido"
        >
          *
        </span>
      )}
    </label>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
Label.propTypes = {
  /** Texto o contenido del label */
  children: PropTypes.node.isRequired,
  /** ID del input asociado para accesibilidad */
  htmlFor: PropTypes.string.isRequired,
  /** Indica si el campo asociado es requerido */
  required: PropTypes.bool,
  /** Tamaño del label que afecta font-size y spacing */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Clases CSS adicionales para personalización */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
Label.defaultProps = {
  required: false,
  size: 'md',
  className: '',
};

export default Label;