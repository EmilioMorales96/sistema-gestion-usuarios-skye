import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * @fileoverview Componente Input atómico para CatWare Systems
 * Input reutilizable con soporte completo para temas, validación y accesibilidad
 * Extrae la lógica común de inputs de LoginForm y RegisterForm
 */

/**
 * @component Input
 * @description Componente de input reutilizable con soporte para temas dinámicos,
 * validación visual, iconos opcionales y accesibilidad completa.
 * Implementa el patrón de diseño gótico con efectos visuales suaves.
 * 
 * Características:
 * - Soporte completo para temas claro/oscuro
 * - Estados visuales para error, focus, disabled
 * - Efectos de hover y focus góticos
 * - Accesibilidad WCAG 2.1 AA completa
 * - Iconos opcionales con Lucide React
 * - Animaciones y transiciones suaves
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del input para accesibilidad
 * @param {string} props.name - Nombre del campo para formularios
 * @param {string} [props.type='text'] - Tipo de input (text, email, password, etc.)
 * @param {string} props.value - Valor controlado del input
 * @param {Function} props.onChange - Callback para cambios de valor
 * @param {Function} [props.onFocus] - Callback opcional para evento focus
 * @param {Function} [props.onBlur] - Callback opcional para evento blur
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.required=false] - Campo requerido
 * @param {string} [props.autoComplete] - Atributo autocomplete
 * @param {boolean} [props.hasError=false] - Estado de error visual
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el input
 * @param {React.Component} [props.icon] - Componente de icono opcional
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento JSX del input
 * 
 * @example
 * <Input
 *   id="email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={handleChange}
 *   placeholder="usuario@ejemplo.com"
 *   hasError={!!errors.email}
 *   ariaDescribedBy="email-error"
 *   icon={<Mail size={18} />}
 * />
 */
const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  hasError = false,
  ariaDescribedBy,
  icon,
  className = '',
  ...props
}) => {
  const { colors, isDark } = useTheme();

  /**
   * Maneja el evento focus con efectos visuales góticos
   * Aplica color primario y sombra en modo oscuro
   * 
   * @param {Event} e - Evento de focus
   */
  const handleFocus = (e) => {
    e.target.style.borderBottomColor = colors.primary;
    if (isDark) {
      e.target.style.boxShadow = `0 2px 8px ${colors.primary}40`;
    }
    
    // Ejecutar callback personalizado si existe
    if (onFocus) {
      onFocus(e);
    }
  };

  /**
   * Maneja el evento blur restaurando estilos originales
   * Mantiene color de error si existe
   * 
   * @param {Event} e - Evento de blur
   */
  const handleBlur = (e) => {
    e.target.style.borderBottomColor = hasError ? colors.error : colors.lightGray;
    e.target.style.boxShadow = 'none';
    
    // Ejecutar callback personalizado si existe
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input principal con estilos dinámicos */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className="w-full px-0 py-3 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors duration-200"
        style={{
          borderBottomColor: hasError ? colors.error : colors.lightGray,
          color: colors.darkGray,
          fontSize: '16px',
          fontWeight: '400'
        }}
        {...props}
      />
      
      {/* Icono opcional posicionado a la derecha */}
      {icon && (
        <div 
          className="absolute right-0 top-3" 
          aria-hidden="true"
          style={{ color: colors.lightGray }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
Input.propTypes = {
  /** ID único del input para accesibilidad y vinculación con labels */
  id: PropTypes.string.isRequired,
  /** Nombre del campo para formularios y manejo de estado */
  name: PropTypes.string.isRequired,
  /** Tipo de input HTML (text, email, password, etc.) */
  type: PropTypes.string,
  /** Valor controlado del input */
  value: PropTypes.string.isRequired,
  /** Función callback ejecutada en cambios de valor */
  onChange: PropTypes.func.isRequired,
  /** Función callback opcional ejecutada en focus */
  onFocus: PropTypes.func,
  /** Función callback opcional ejecutada en blur */
  onBlur: PropTypes.func,
  /** Texto placeholder mostrado cuando el input está vacío */
  placeholder: PropTypes.string,
  /** Estado deshabilitado que previene interacción */
  disabled: PropTypes.bool,
  /** Indica si el campo es requerido para validación */
  required: PropTypes.bool,
  /** Atributo HTML autocomplete para mejor UX */
  autoComplete: PropTypes.string,
  /** Estado de error que cambia estilos visuales */
  hasError: PropTypes.bool,
  /** ID del elemento que describe el input para accesibilidad */
  ariaDescribedBy: PropTypes.string,
  /** Componente de icono opcional (Lucide React) */
  icon: PropTypes.element,
  /** Clases CSS adicionales para personalización */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
Input.defaultProps = {
  type: 'text',
  disabled: false,
  required: false,
  hasError: false,
  className: '',
};

export default Input;