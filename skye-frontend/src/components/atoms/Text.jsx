import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente Text atómico para CatWare Systems
 * Texto reutilizable con soporte completo para temas y variantes góticas
 */

/**
 * @component Text
 * @description Componente de texto con estilos temáticos consistentes.
 * Maneja diferentes variantes, tamaños y efectos góticos automáticamente.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del texto
 * @param {string} [props.variant='body'] - Variante del texto
 * @param {string} [props.size='md'] - Tamaño del texto
 * @param {string} [props.as='p'] - Elemento HTML a renderizar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del texto
 * 
 * @example
 * <Text variant="heading" size="lg" as="h2">
 *   Usuarios del Sistema
 * </Text>
 */
const Text = ({
  children,
  variant = 'body',
  size = 'md',
  as = 'p',
  className = '',
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const Component = as;

  // Obtener estilos según la variante
  const getVariantStyles = () => {
    const baseStyle = {
      transition: 'all 0.3s ease',
    };

    switch (variant) {
      case 'heading':
        return {
          ...baseStyle,
          color: colors.text,
          fontWeight: 'light',
          letterSpacing: '0.05em',
          textShadow: isDark ? `0 0 12px ${colors.primary}30` : 'none',
        };
      
      case 'subheading':
        return {
          ...baseStyle,
          color: colors.textMuted,
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        };
      
      case 'body':
        return {
          ...baseStyle,
          color: isDark ? '#FFFFFF' : colors.text,
          fontWeight: '400',
          textShadow: isDark ? `0 0 6px ${colors.primary}20` : 'none',
        };
      
      case 'muted':
        return {
          ...baseStyle,
          color: isDark ? '#D1D5DB' : colors.textMuted,
          fontWeight: '400',
        };
      
      case 'mono':
        return {
          ...baseStyle,
          color: isDark ? '#D1D5DB' : colors.textMuted,
          fontFamily: 'monospace',
          fontWeight: '400',
        };
      
      default:
        return baseStyle;
    }
  };

  // Obtener clases de tamaño
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      case '2xl':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  // Obtener clases adicionales según variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'heading':
        return `tracking-wider ${isDark ? 'drop-shadow-lg' : ''}`;
      case 'subheading':
        return 'tracking-wider uppercase';
      case 'body':
        return `tracking-wide ${isDark ? 'drop-shadow-sm' : ''}`;
      case 'muted':
        return 'tracking-normal';
      case 'mono':
        return 'font-mono';
      default:
        return '';
    }
  };

  return (
    <Component
      className={`${getSizeClasses()} ${getVariantClasses()} transition-all duration-300 ${className}`}
      style={getVariantStyles()}
      {...props}
    >
      {children}
    </Component>
  );
};

// Validación de tipos con PropTypes
Text.propTypes = {
  /** Contenido del texto */
  children: PropTypes.node.isRequired,
  /** Variante del estilo de texto */
  variant: PropTypes.oneOf(['heading', 'subheading', 'body', 'muted', 'mono']),
  /** Tamaño del texto */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Elemento HTML a renderizar */
  as: PropTypes.string,
  /** Clases CSS adicionales */
  className: PropTypes.string,
};

// Valores por defecto
Text.defaultProps = {
  variant: 'body',
  size: 'md',
  as: 'p',
  className: '',
};

export default Text;