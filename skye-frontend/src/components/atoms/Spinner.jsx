import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente Spinner atómico para CatWare Systems
 * Spinner de carga reutilizable con soporte completo para temas
 */

/**
 * @component Spinner
 * @description Componente de spinner de carga con estilos temáticos góticos.
 * Diseñado para estados de carga y procesamiento asíncrono.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='md'] - Tamaño del spinner (sm, md, lg)
 * @param {string} [props.message=''] - Mensaje opcional bajo el spinner
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del spinner
 * 
 * @example
 * <Spinner size="lg" message="Cargando usuarios..." />
 */
const Spinner = ({
  size = 'md',
  message = '',
  className = ''
}) => {
  const { colors, isDark } = useTheme();

  // Determinar tamaños según la prop size
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner circular con animación */}
      <div 
        className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full animate-spin mb-4`}
        style={{
          borderColor: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
        aria-hidden="true"
      ></div>
      
      {/* Mensaje opcional */}
      {message && (
        <p 
          className={`${textSizeClasses[size]} font-medium tracking-wider transition-all duration-300 ${isDark ? 'drop-shadow-lg' : ''}`} 
          style={{ 
            color: colors.text,
            textShadow: isDark ? `0 0 10px ${colors.primary}40` : 'none'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

// Validación de tipos con PropTypes
Spinner.propTypes = {
  /** Tamaño del spinner */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Mensaje opcional a mostrar */
  message: PropTypes.string,
  /** Clases CSS adicionales */
  className: PropTypes.string,
};

// Valores por defecto
Spinner.defaultProps = {
  size: 'md',
  message: '',
  className: '',
};

export default Spinner;