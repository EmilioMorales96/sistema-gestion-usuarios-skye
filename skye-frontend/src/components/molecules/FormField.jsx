import PropTypes from 'prop-types';
import { Input, Label, ErrorMessage } from '../atoms';

/**
 * @fileoverview Componente FormField molecular para CatWare Systems
 * Combina Label, Input y ErrorMessage en un campo de formulario completo
 * Implementa el patrón molecular del Atomic Design simplificando el uso de formularios
 */

/**
 * @component FormField
 * @description Componente molecular que combina Label, Input y ErrorMessage
 * para crear campos de formulario completos y consistentes. Reduce la duplicación
 * de código y estandariza la estructura de campos en todos los formularios.
 * 
 * Características:
 * - Combina tres atoms en un solo componente reutilizable
 * - Manejo automático de IDs y accesibilidad
 * - Propagación de errores y estados
 * - Configuración flexible de todos los atoms internos
 * - Mantiene toda la funcionalidad de los atoms individuales
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del campo para accesibilidade
 * @param {string} props.name - Nombre del campo para formularios
 * @param {string} props.label - Texto del label
 * @param {string} [props.type='text'] - Tipo de input
 * @param {string} props.value - Valor controlado del input
 * @param {Function} props.onChange - Callback para cambios de valor
 * @param {Function} [props.onFocus] - Callback opcional para evento focus
 * @param {Function} [props.onBlur] - Callback opcional para evento blur
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.required=false] - Campo requerido
 * @param {string} [props.autoComplete] - Atributo autocomplete
 * @param {string} [props.error] - Mensaje de error para mostrar
 * @param {React.Component} [props.icon] - Icono opcional para el input
 * @param {string} [props.labelSize='md'] - Tamaño del label
 * @param {string} [props.errorType='error'] - Tipo de mensaje de error
 * @param {string} [props.className=''] - Clases CSS adicionales para el contenedor
 * @returns {JSX.Element} Elemento JSX del campo de formulario completo
 * 
 * @example
 * <FormField
 *   id="email"
 *   name="email"
 *   label="Correo Electrónico"
 *   type="email"
 *   value={formData.email}
 *   onChange={handleChange}
 *   placeholder="usuario@ejemplo.com"
 *   required
 *   error={errors.email}
 *   icon={<Mail size={18} />}
 * />
 */
const FormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  error,
  icon,
  labelSize = 'md',
  errorType = 'error',
  className = '',
  ...props
}) => {
  // Generar ID único si no se proporciona
  const fieldId = id || `field-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label del campo */}
      <Label 
        htmlFor={fieldId} 
        required={required}
        size={labelSize}
      >
        {label}
      </Label>
      
      {/* Input principal */}
      <Input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        hasError={!!error}
        ariaDescribedBy={errorId}
        icon={icon}
        {...props}
      />
      
      {/* Mensaje de error */}
      <ErrorMessage 
        id={errorId} 
        type={errorType} 
        size="sm"
      >
        {error}
      </ErrorMessage>
    </div>
  );
};

/**
 * Definición de PropTypes para validación de tipos en tiempo de desarrollo
 * Garantiza que los props pasados al componente tengan los tipos correctos
 */
FormField.propTypes = {
  /** ID único del campo para accesibilidad */
  id: PropTypes.string,
  /** Nombre del campo para formularios */
  name: PropTypes.string.isRequired,
  /** Texto del label del campo */
  label: PropTypes.string.isRequired,
  /** Tipo de input HTML */
  type: PropTypes.string,
  /** Valor controlado del input */
  value: PropTypes.string.isRequired,
  /** Función callback para cambios de valor */
  onChange: PropTypes.func.isRequired,
  /** Función callback opcional para evento focus */
  onFocus: PropTypes.func,
  /** Función callback opcional para evento blur */
  onBlur: PropTypes.func,
  /** Texto placeholder del input */
  placeholder: PropTypes.string,
  /** Estado deshabilitado */
  disabled: PropTypes.bool,
  /** Si el campo es requerido */
  required: PropTypes.bool,
  /** Atributo HTML autocomplete */
  autoComplete: PropTypes.string,
  /** Mensaje de error para mostrar */
  error: PropTypes.string,
  /** Componente de icono opcional */
  icon: PropTypes.element,
  /** Tamaño del label */
  labelSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Tipo de mensaje de error */
  errorType: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  /** Clases CSS adicionales */
  className: PropTypes.string,
};

/**
 * Valores por defecto para props opcionales
 * Asegura comportamiento consistente cuando no se proporcionan ciertos props
 */
FormField.defaultProps = {
  type: 'text',
  disabled: false,
  required: false,
  labelSize: 'md',
  errorType: 'error',
  className: '',
};

export default FormField;