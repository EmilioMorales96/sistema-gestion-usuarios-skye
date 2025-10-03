import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @fileoverview Contexto de tema para la aplicación CatWare Systems
 * Proporciona funcionalidad de tema claro/oscuro con persistencia
 * Implementa diseño para modo oscuro y editorial para modo claro
 */

/**
 * Paletas de colores para temas claro y oscuro
 * 
 * @constant {Object} themes
 * @property {Object} light - Tema claro con paleta editorial CatWare
 * @property {Object} dark - Tema oscuro con paleta gótica
 */
export const themes = {
  light: {
    // Paleta  de página CatWare 
    background: '#F5F5F0',      // Fondo principal beige claro
    surface: '#E8E6E1',        // Superficie intermedia
    accent: '#D4D1C9',         // Acento beige
    primary: '#D4AF37',        // Oro para elementos destacados
    secondary: '#B8941F',      // Oro más oscuro
    text: '#2C2C2C',           // Texto principal oscuro
    textMuted: '#5A5A5A',      // Texto secundario gris medio
    border: '#9A9A9A',         // Bordes gris claro
    darkGray: '#2C2C2C',       // Gris oscuro para texto
    mediumGray: '#5A5A5A',     // Gris medio
    lightGray: '#9A9A9A',      // Gris claro
    white: '#FFFFFF',          // Blanco puro
    shadow: 'rgba(0,0,0,0.1)', // Sombra sutil
    error: '#C41E3A',          // Rojo elegante para errores
    success: '#2D5A2D'         // Verde oscuro para éxito
  },
  dark: {
    // Paleta Dark Theme
    background: '#0A0A0A',      // Negro profundo
    surface: '#1A1A1A',        // Gris muy oscuro
    accent: '#2A2A2A',         // Gris oscuro
    primary: '#DC2626',        // Rojo intenso 
    secondary: '#B91C1C',      // Rojo más oscuro
    text: '#FFFFFF',           // Texto blanco 
    textMuted: '#D1D5DB',      // Texto secundario gris claro 
    border: '#374151',         // Bordes gris oscuro
    darkGray: '#F5F5F5',       // Blanco suave (invertido)
    mediumGray: '#D1D5DB',     // Gris claro
    lightGray: '#9CA3AF',      // Gris medio
    white: '#0A0A0A',          // Negro (invertido)
    shadow: 'rgba(220,38,38,0.2)', // Sombra roja
    error: '#EF4444',          // Rojo más brillante 
    success: '#10B981'         // Verde más brillante
  }
};

// Crear contexto de tema
const ThemeContext = createContext();

/**
 * Hook personalizado para acceder al contexto de tema
 * Proporciona estado del tema, función de toggle y colores actuales
 * 
 * @returns {Object} Objeto con propiedades del tema
 * @returns {string} theme - Tema actual ('light' | 'dark')
 * @returns {boolean} isDark - Si el tema actual es oscuro
 * @returns {Object} colors - Paleta de colores del tema actual
 * @returns {Function} toggleTheme - Función para cambiar tema
 * 
 * @throws {Error} Si se usa fuera de ThemeProvider
 * 
 * @example
 * const { isDark, colors, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Proveedor de contexto de tema
 * Gestiona el estado del tema y proporciona persistencia en localStorage
 * Detecta preferencias del sistema operativo para tema inicial
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijo
 * @returns {JSX.Element} Proveedor de contexto
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider = ({ children }) => {
  // Estado del tema (false = light, true = dark)
  const [isDark, setIsDark] = useState(false);

  /**
   * Effect para cargar tema desde localStorage o detectar preferencia del sistema
   * Se ejecuta solo una vez al montar el componente
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('catware-theme');
    
    if (savedTheme) {
      // Si hay tema guardado, usarlo
      setIsDark(savedTheme === 'dark');
    } else {
      // Si no hay tema guardado, detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  /**
   * Effect para persistir cambios de tema en localStorage
   * Se ejecuta cada vez que cambia isDark
   */
  useEffect(() => {
    const themeValue = isDark ? 'dark' : 'light';
    localStorage.setItem('catware-theme', themeValue);
    
    // Actualizar atributo data-theme en el documento para CSS global
    document.documentElement.setAttribute('data-theme', themeValue);
  }, [isDark]);

  /**
   * Función para alternar entre tema claro y oscuro
   * Incluye haptic feedback en dispositivos compatibles
   */
  const toggleTheme = () => {
    setIsDark(prev => !prev);
    
    // Haptic feedback en dispositivos móviles compatibles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Obtener paleta de colores del tema actual
  const currentTheme = isDark ? themes.dark : themes.light;

  // Valor del contexto con todas las propiedades necesarias
  const value = {
    isDark,
    toggleTheme,
    colors: currentTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Validación de tipos con PropTypes
ThemeProvider.propTypes = {
  /** Componentes hijo que tendrán acceso al contexto de tema */
  children: PropTypes.node.isRequired,
};