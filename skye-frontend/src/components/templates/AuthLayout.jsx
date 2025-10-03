import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Square, Triangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../atoms/ThemeToggle';
import catwareLogo from '../../assets/catware.jpg';

/**
 * @fileoverview Layout de autenticación para CatWare Systems
 * Proporciona el marco visual para páginas de login y registro
 * Implementa accesibilidad completa y diseño responsivo
 */

/**
 * Componente de layout para páginas de autenticación
 * Incluye gradientes temáticos, elementos decorativos y accesibilidad
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a mostrar (LoginForm/RegisterForm)
 * @param {string} [props.title] - Título de la página para SEO y accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Layout de autenticación accesible
 * 
 * @example
 * <AuthLayout title="Iniciar Sesión">
 *   <LoginForm />
 * </AuthLayout>
 */
const AuthLayout = ({ 
  children,
  title,
  className = ''
}) => {
  const { isDark, colors } = useTheme();

  // Efecto para establecer el título de la página
  React.useEffect(() => {
    if (title) {
      document.title = `${title} - CatWare Systems`;
    }
  }, [title]);

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={{
        background: isDark 
          ? `linear-gradient(135deg, ${colors.background} 0%, #0F0F0F 50%, #1A1A1A 100%)`
          : `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 50%, ${colors.accent} 100%)`
      }}
      role="main"
      aria-label={title ? `Página de ${title}` : 'Página de autenticación'}
    >
      {/* Skip to main content link for screen readers - Hidden by default */}
      <a 
        href="#main-content" 
        className="absolute -top-40 left-4 focus:top-4 transition-all duration-200 px-4 py-2 rounded z-50 focus:outline-none"
        style={{
          backgroundColor: colors.primary,
          color: isDark ? colors.background : colors.white,
          opacity: 0,
          transform: 'translateY(-100%)'
        }}
        onFocus={(e) => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          e.target.style.opacity = '0';
          e.target.style.transform = 'translateY(-100%)';
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Theme Toggle - Positioned absolutely */}
      <div className="absolute top-6 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Editorial Grid */}
        <div 
          className={`absolute left-8 top-0 bottom-0 w-px transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} 
          style={{ 
            background: colors.textMuted,
            boxShadow: isDark ? `0 0 20px ${colors.primary}10` : 'none'
          }}
        ></div>
        <div 
          className={`absolute right-8 top-0 bottom-0 w-px transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} 
          style={{ 
            background: colors.textMuted,
            boxShadow: isDark ? `0 0 20px ${colors.primary}10` : 'none'
          }}
        ></div>
        <div 
          className={`absolute top-20 left-0 right-0 h-px transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} 
          style={{ 
            background: colors.textMuted,
            boxShadow: isDark ? `0 0 20px ${colors.primary}10` : 'none'
          }}
        ></div>
        
        {/* Primary Circle */}
        <div 
          className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full border transition-all duration-500 ${isDark ? 'opacity-30' : 'opacity-10'}`} 
          style={{ 
            borderColor: colors.primary,
            boxShadow: isDark ? `0 0 60px ${colors.primary}20` : 'none'
          }}
        ></div>
      </div>

      {/* Decorative Icons */}
      <div 
        className={`absolute top-20 left-10 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
        aria-hidden="true"
      >
        <Circle size={24} />
      </div>
      <div 
        className={`absolute top-40 right-16 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
        aria-hidden="true"
      >
        <Square size={20} />
      </div>
      <div 
        className={`absolute bottom-40 left-16 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
        aria-hidden="true"
      >
        <Triangle size={28} />
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div 
              className={`inline-flex items-center justify-center w-20 h-20 mb-6 overflow-hidden transition-all duration-300 ${isDark ? 'shadow-2xl' : ''}`}
              style={{
                background: colors.surface,
                border: `3px solid ${colors.primary}`,
                borderRadius: '12px',
                boxShadow: isDark ? `0 0 30px ${colors.primary}40` : `0 8px 25px ${colors.shadow}`
              }}
            >
              <img 
                src={catwareLogo} 
                alt="CatWare Systems Logo" 
                className={`w-12 h-12 object-contain transition-all duration-300 ${isDark ? 'brightness-110' : ''}`}
                style={{
                  filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}60)` : 'none'
                }}
              />
            </div>
            
            <h1 
              className={`text-3xl font-light tracking-wider mb-2 transition-all duration-300 ${isDark ? 'drop-shadow-lg' : ''}`}
              style={{ 
                color: colors.text,
                textShadow: isDark ? `0 0 15px ${colors.primary}40` : 'none'
              }}
            >
              CatWare Systems
            </h1>
            <p 
              className="text-sm font-medium tracking-widest uppercase transition-colors duration-300"
              style={{ color: colors.textMuted }}
            >
              Plataforma de Gestión
            </p>
          </div>

          {/* Main Content Area */}
          <main 
            id="main-content"
            className={`backdrop-blur-lg transition-all duration-500 ${isDark ? 'shadow-2xl' : ''}`}
            style={{
              background: `${colors.surface}95`,
              border: `2px solid ${colors.primary}`,
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: isDark 
                ? `0 0 40px ${colors.primary}20, inset 0 0 20px ${colors.primary}10` 
                : `0 20px 50px ${colors.shadow}`
            }}
            role="region"
            aria-label="Formulario de autenticación"
          >
            {children}
          </main>

          {/* Footer */}
          <footer className="text-center mt-8">
            <p 
              className="text-xs tracking-wider transition-colors duration-300"
              style={{ color: colors.textMuted }}
            >
              © 2025 CatWare Systems. Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </div>

      {/* Glow Effect Overlay for Dark Mode */}
      {isDark && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${colors.primary}05 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colors.primary}05 0%, transparent 50%)`,
            opacity: 0.8
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

// Validación de tipos con PropTypes
AuthLayout.propTypes = {
  /** Contenido a mostrar dentro del layout (LoginForm, RegisterForm, etc.) */
  children: PropTypes.node.isRequired,
  /** Título de la página para SEO y accesibilidad */
  title: PropTypes.string,
  /** Clases CSS adicionales para personalizar el estilo */
  className: PropTypes.string,
};

// Valores por defecto de las props
AuthLayout.defaultProps = {
  title: 'Autenticación',
  className: '',
};

export default AuthLayout;