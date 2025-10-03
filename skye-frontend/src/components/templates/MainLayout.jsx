import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Database, Users, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../atoms/ThemeToggle';

const MainLayout = ({ 
  children,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isDark, colors } = useTheme();
  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${className}`}
      style={{
        background: isDark 
          ? `linear-gradient(135deg, ${colors.background} 0%, #0F0F0F 50%, #1A1A1A 100%)`
          : `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 50%, ${colors.accent} 100%)`
      }}
    >
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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
          className={`absolute top-16 left-0 right-0 h-px transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} 
          style={{ 
            background: colors.textMuted,
            boxShadow: isDark ? `0 0 20px ${colors.primary}10` : 'none'
          }}
        ></div>
        <div 
          className={`absolute bottom-16 left-0 right-0 h-px transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} 
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

      {/* Geometric Icons */}
      <div 
        className={`absolute top-20 left-10 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
      >
        <Database size={24} />
      </div>
      <div 
        className={`absolute top-40 right-16 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
      >
        <Activity size={20} />
      </div>
      <div 
        className={`absolute bottom-40 left-16 transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ 
          color: colors.textMuted,
          filter: isDark ? `drop-shadow(0 0 8px ${colors.primary}30)` : 'none'
        }}
      >
        <Users size={28} />
      </div>

      {/* Header Bar */}
      <div 
        className={`relative z-10 transition-all duration-500 ${isDark ? 'shadow-2xl' : ''}`}
        style={{
          backdropFilter: 'blur(10px)',
          background: `${colors.surface}90`,
          borderBottom: `2px solid ${colors.primary}`,
          boxShadow: isDark ? `0 0 30px ${colors.primary}20` : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div 
                className={`p-2 transition-all duration-300 ${isDark ? 'shadow-lg' : ''}`}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.primary}`,
                  boxShadow: isDark ? `0 0 15px ${colors.primary}30` : 'none'
                }}
              >
                <Users 
                  className="w-6 h-6" 
                  style={{ 
                    color: colors.primary,
                    filter: isDark ? `drop-shadow(0 0 6px ${colors.primary}60)` : 'none'
                  }} 
                />
              </div>
              <h1 
                className={`text-xl font-light tracking-wider transition-all duration-300 ${isDark ? 'drop-shadow-lg' : ''}`}
                style={{ 
                  color: colors.text,
                  textShadow: isDark ? `0 0 12px ${colors.primary}30` : 'none'
                }}
              >
                Panel CatWare
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm transition-colors duration-300" style={{ color: colors.textMuted }}>
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${isDark ? 'shadow-sm' : ''}`}
                  style={{ 
                    backgroundColor: colors.primary,
                    boxShadow: isDark ? `0 0 8px ${colors.primary}60` : 'none'
                  }}
                ></div>
                <span className="tracking-wider uppercase font-medium">Sistema Activo</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </div>

      {/* Bottom Decoration */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500"
        style={{
          background: colors.primary,
          boxShadow: isDark ? `0 0 20px ${colors.primary}40` : 'none'
        }}
      ></div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default MainLayout;