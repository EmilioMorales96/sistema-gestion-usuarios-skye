import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LogOut, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Spinner, IconBox, Text } from '../atoms';

/**
 * @fileoverview Componente de tabla de usuarios para CatWare Systems
 * Muestra lista de usuarios registrados con funcionalidades de ordenamiento
 * Implementa accesibilidad completa, diseño responsivo y modo oscuro
 */

/**
 * Componente de tabla para mostrar y gestionar usuarios del sistema
 * Incluye ordenamiento por columnas, estados de carga y botón de logout
 * Optimizado para accesibilidad y modo oscuro gótico
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} [props.users=[]] - Array de usuarios a mostrar
 * @param {Function} props.onLogout - Callback para cerrar sesión
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Tabla de usuarios accesible y temática
 * 
 * @example
 * <UserTable 
 *   users={[
 *     { id: 1, name: 'Juan Pérez', email: 'juan@test.com', created_at: '2024-01-01' }
 *   ]}
 *   onLogout={() => handleLogout()}
 *   loading={false}
 * />
 */
const UserTable = ({ 
  users = [],
  onLogout,
  loading = false,
  className = ''
}) => {
  // Hook de tema para colores y modo oscuro
  const { isDark, colors } = useTheme();
  
  // Estados para el ordenamiento de la tabla
  /** @type {string} Campo actual por el cual se está ordenando */
  const [sortField, setSortField] = useState('name');
  
  /** @type {'asc'|'desc'} Dirección del ordenamiento actual */
  const [sortDirection, setSortDirection] = useState('asc');

  /**
   * Memo que ordena los usuarios según el campo y dirección seleccionados
   * Optimiza el rendimiento recalculando solo cuando cambian las dependencias
   * Maneja diferentes tipos de datos: strings, fechas, números
   * 
   * @returns {Array<Object>} Array de usuarios ordenados
   */
  const sortedUsers = useMemo(() => {
    // Si no hay usuarios, retornar array vacío
    if (!users.length) return [];

    // Crear copia del array para no mutar el original
    return [...users].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Manejo especial para ordenamiento de fechas
      if (sortField === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para ordenamiento de strings (case-insensitive)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Lógica de comparación con dirección
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortField, sortDirection]);

  /**
   * Maneja el clic en los headers de la tabla para ordenamiento
   * Si se hace clic en la misma columna, invierte la dirección
   * Si se hace clic en una columna diferente, la establece como campo de ordenamiento
   * 
   * @param {string} field - Campo por el cual ordenar ('name', 'email', 'created_at')
   */
  const handleSort = (field) => {
    if (sortField === field) {
      // Si es el mismo campo, invertir dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es campo diferente, establecerlo y empezar con 'asc'
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Formatea una fecha ISO string a formato legible en español
   * 
   * @param {string} dateString - Fecha en formato ISO (ej: "2024-01-15T10:30:00Z")
   * @returns {string} Fecha formateada (ej: "15 ene 2024")
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Retorna el ícono de ordenamiento apropiado para cada columna
   * Muestra el estado visual del ordenamiento actual
   * 
   * @param {string} field - Campo de la columna
   * @returns {JSX.Element} Ícono de ChevronUp o ChevronDown con estilos temáticos
   */
  const getSortIcon = (field) => {
    // Si no es el campo activo, mostrar ícono neutral
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4" style={{ color: colors.textMuted, opacity: 0.4 }} />;
    }
    
    // Si es el campo activo, mostrar dirección con efectos góticos
    return sortDirection === 'asc' ? 
      <ChevronUp 
        className="w-4 h-4" 
        style={{ 
          color: colors.primary,
          filter: isDark ? `drop-shadow(0 0 4px ${colors.primary}60)` : 'none'
        }} 
      /> : 
      <ChevronDown 
        className="w-4 h-4" 
        style={{ 
          color: colors.primary,
          filter: isDark ? `drop-shadow(0 0 4px ${colors.primary}60)` : 'none'
        }} 
      />;
  };

  // Estado de carga - Mostrar spinner con estilo temático
  if (loading) {
    return (
      <div 
        className={`p-8 transition-all duration-500 ${isDark ? 'shadow-2xl' : ''} ${className}`}
        style={{
          background: colors.background,
          border: `2px solid ${colors.primary}`,
          backdropFilter: 'blur(10px)',
          boxShadow: isDark ? `0 0 30px ${colors.primary}20` : 'none'
        }}
        role="status"
        aria-label="Cargando usuarios"
      >
        <div className="py-12">
          <Spinner size="md" message="Cargando Usuarios..." />
        </div>
      </div>
    );
  }

  // Componente principal de la tabla
  return (
    <div 
      className={`p-8 transition-all duration-500 ${isDark ? 'shadow-2xl' : ''} ${className}`}
      style={{
        background: colors.background,
        border: `2px solid ${colors.primary}`,
        backdropFilter: 'blur(10px)',
        boxShadow: isDark ? `0 0 30px ${colors.primary}20` : 'none'
      }}
      role="region"
      aria-label="Tabla de usuarios del sistema"
    >
      {/* Header de la tabla con título y botón de logout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        {/* Sección izquierda: Icono y título */}
        <div className="flex items-center space-x-4">
          {/* Icono de usuarios con efectos temáticos */}
          <IconBox size="md">
            <Users className="w-6 h-6" />
          </IconBox>
          {/* Información del título y contador */}
          <div>
            <Text variant="heading" size="2xl" as="h2">
              Usuarios del Sistema
            </Text>
            <Text variant="subheading" size="sm">
              {users.length} Registrados
            </Text>
          </div>
        </div>
        
        <Button
          key="logout-button"
          onClick={onLogout}
          variant="danger"
          size="md"
          className="flex items-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm tracking-wider uppercase">Cerrar Sesión</span>
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16">
          <div 
            className="mx-auto mb-4 w-16 h-16 flex items-center justify-center"
            style={{ 
              color: colors.textMuted, 
              opacity: 0.5,
              filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}20)` : 'none'
            }}
          >
            <Users className="w-16 h-16" />
          </div>
          <Text variant="muted" size="lg">
            No hay Usuarios Registrados
          </Text>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div 
            className={`overflow-x-auto transition-all duration-300 ${isDark ? 'shadow-inner' : ''}`}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}40`,
              boxShadow: isDark ? `inset 0 0 20px ${colors.primary}10` : 'none'
            }}
          >
            <table className="min-w-full">
              <thead>
                <tr 
                  className="transition-all duration-300"
                  style={{
                    background: colors.accent,
                    borderBottom: `2px solid ${colors.primary}`,
                    boxShadow: isDark ? `0 2px 10px ${colors.primary}20` : 'none'
                  }}
                >
                  <th 
                    className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-widest cursor-pointer transition-all duration-300 ${isDark ? 'hover:drop-shadow-sm' : ''}`}
                    onClick={() => handleSort('name')}
                    style={{ 
                      color: isDark ? '#FFFFFF' : colors.text,
                      textShadow: isDark ? `0 0 8px ${colors.primary}20` : 'none'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Nombre</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-widest transition-all duration-300 ${isDark ? 'hover:drop-shadow-sm' : ''}`}
                    style={{ 
                      color: isDark ? '#FFFFFF' : colors.text,
                      textShadow: isDark ? `0 0 8px ${colors.primary}20` : 'none'
                    }}
                  >
                    Correo Electrónico
                  </th>
                  <th 
                    className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-widest cursor-pointer transition-all duration-300 ${isDark ? 'hover:drop-shadow-sm' : ''}`}
                    onClick={() => handleSort('created_at')}
                    style={{ 
                      color: isDark ? '#FFFFFF' : colors.text,
                      textShadow: isDark ? `0 0 8px ${colors.primary}20` : 'none'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Fecha de Creación</span>
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr 
                    key={user.id}
                    className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{
                      borderBottom: index !== sortedUsers.length - 1 ? `1px solid ${colors.border}30` : 'none',
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" size="sm" className="font-medium">
                        {user.name}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="mono" size="sm">
                        {user.email}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="muted" size="sm">
                        {formatDate(user.created_at)}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Validación de tipos con PropTypes - Definiciones detalladas
UserTable.propTypes = {
  /** 
   * Array de objetos usuario para mostrar en la tabla
   * Cada usuario debe tener las propiedades requeridas para el renderizado
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      /** ID único del usuario (string o number) */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      /** Nombre completo del usuario */
      name: PropTypes.string.isRequired,
      /** Correo electrónico del usuario */
      email: PropTypes.string.isRequired,
      /** Fecha de creación en formato ISO string */
      created_at: PropTypes.string.isRequired,
    })
  ),
  /** Función callback para manejar el logout del usuario */
  onLogout: PropTypes.func.isRequired,
  /** Estado de carga para mostrar spinner */
  loading: PropTypes.bool,
  /** Clases CSS adicionales para personalizar el estilo */
  className: PropTypes.string,
};

// Valores por defecto de las props
UserTable.defaultProps = {
  users: [],
  loading: false,
  className: '',
};

export default UserTable;