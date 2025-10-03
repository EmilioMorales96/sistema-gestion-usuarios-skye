import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente IconBox atómico para CatWare Systems
 * Contenedor de íconos reutilizable con efectos temáticos góticos
 */

/**
 * @component IconBox
 * @description Contenedor estilizado para íconos con efectos góticos y soporte de temas.
 * Diseñado para darle un look consistente a los íconos en toda la aplicación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Ícono a renderizar (usualmente de Lucide)
 * @param {string} [props.size='md'] - Tamaño del contenedor (sm, md, lg)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del contenedor de ícono
 * 
 * @example
 * <IconBox size="lg">
 *   <Users className="w-6 h-6" />
 * </IconBox>
 */
const IconBox = ({
  children,
  size = 'md',
  className = ''
}) => {
  const { colors, isDark } = useTheme();

  // Determinar padding según el tamaño
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} transition-all duration-300 ${isDark ? 'shadow-lg' : ''} ${className}`}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.primary}`,
        boxShadow: isDark ? `0 0 15px ${colors.primary}30` : 'none'
      }}
      aria-hidden="true"
    >
      <div
        style={{ 
          color: colors.primary,
          filter: isDark ? `drop-shadow(0 0 6px ${colors.primary}60)` : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Validación de tipos con PropTypes
IconBox.propTypes = {
  /** Ícono a renderizar dentro del contenedor */
  children: PropTypes.node.isRequired,
  /** Tamaño del contenedor */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Clases CSS adicionales */
  className: PropTypes.string,
};

// Valores por defecto
IconBox.defaultProps = {
  size: 'md',
  className: '',
};

export default IconBox;