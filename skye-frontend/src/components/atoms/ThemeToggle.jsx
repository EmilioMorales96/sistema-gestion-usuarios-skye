import { Moon, Sun } from 'lucide-react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Componente de toggle para cambiar entre tema claro y oscuro
 * Implementa accesibilidad completa con ARIA y navegación por teclado
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Botón de toggle de tema accesible
 * 
 * @example
 * return (
 *   <ThemeToggle />
 * )
 */
const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  /**
   * Maneja el cambio de tema con navegación por teclado
   * @param {KeyboardEvent} event - Evento de teclado
   */
  const handleKeyDown = (event) => {
    // Permitir activación con Enter o Espacio
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`relative p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      style={{
        background: isDark 
          ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent} 100%)`
          : `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent} 100%)`,
        border: `2px solid ${colors.primary}`,
        boxShadow: isDark 
          ? `0 0 20px ${colors.primary}40`
          : `0 4px 12px ${colors.shadow}`,
        '--focus-ring-color': colors.primary
      }}
      // Atributos de accesibilidad ARIA
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={isDark}
      role="switch"
      title={isDark ? 'Activar modo claro (actualmente modo oscuro)' : 'Activar modo oscuro (actualmente modo claro)'}
      tabIndex={0}
    >
      {/* Icon Container con indicador visual del estado */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Icono Sol - Modo Claro */}
        <Sun 
          className={`absolute transition-all duration-500 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-50' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
          style={{ color: colors.primary }}
          size={24}
          aria-hidden={isDark}
        />
        
        {/* Icono Luna - Modo Oscuro */}
        <Moon 
          className={`absolute transition-all duration-500 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-50'
          }`}
          style={{ 
            color: colors.primary,
            filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}60)` : 'none'
          }}
          size={24}
          aria-hidden={!isDark}
        />
      </div>

      {/* Glow Effect for Dark Mode */}
      {isDark && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
            filter: 'blur(8px)'
          }}
        />
      )}
    </button>
  );
};

// Validación de tipos con PropTypes
ThemeToggle.propTypes = {
  /** Clases CSS adicionales para personalizar el estilo */
  className: PropTypes.string,
};

// Valores por defecto de las props
ThemeToggle.defaultProps = {
  className: '',
};

export default ThemeToggle;