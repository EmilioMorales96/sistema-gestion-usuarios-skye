import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, User, ArrowRight, Timer } from 'lucide-react';
import { AuthLayout } from '../components/templates';
import { Button } from '../components/atoms';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Página de confirmación de usuario creado
 * Muestra mensaje de éxito y redirige al login
 */
const UserCreatedPage = () => {
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useTheme();

  // Obtener datos del usuario de la navegación
  const userData = location.state?.user || { name: 'Usuario' };

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 300);

    // Countdown automático
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <div className={`w-full max-w-md mx-auto transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Success Icon with Animation */}
        <div className="text-center mb-8">
          <div 
            className={`inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full transition-all duration-500 ${
              isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
            } ${isDark ? 'shadow-xl' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
              border: `3px solid ${colors.primary}`,
              boxShadow: isDark ? `0 0 30px ${colors.primary}40` : `0 10px 25px ${colors.primary}20`
            }}
          >
            <CheckCircle 
              className={`w-12 h-12 transition-all duration-700 delay-300 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              } ${isDark ? 'drop-shadow-lg' : ''}`} 
              style={{ 
                color: colors.primary,
                filter: isDark ? `drop-shadow(0 0 12px ${colors.primary}60)` : 'none'
              }} 
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8 space-y-4">
          <h1 
            className={`text-3xl font-light tracking-wider mb-3 transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${isDark ? 'drop-shadow-lg' : ''}`}
            style={{ 
              color: colors.text,
              textShadow: isDark ? `0 0 15px ${colors.primary}30` : 'none'
            }}
          >
            ¡Cuenta Creada!
          </h1>
          
          <div 
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <p 
              className="text-lg mb-2 font-medium"
              style={{ color: colors.text }}
            >
              ¡Bienvenido, <span style={{ color: colors.primary }}>{userData.name}</span>! 🎉
            </p>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              Tu cuenta ha sido creada exitosamente.
              <br />
              Ya puedes iniciar sesión y acceder al dashboard.
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <div 
          className={`p-6 rounded-lg mb-8 transition-all duration-700 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${isDark ? 'shadow-lg backdrop-blur-sm' : 'shadow-sm'}`}
          style={{
            background: isDark ? `${colors.surface}40` : `${colors.surface}90`,
            border: `1px solid ${colors.primary}20`,
            boxShadow: isDark ? `0 0 20px ${colors.primary}10` : 'none'
          }}
        >
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}30`
              }}
            >
              <User 
                className="w-6 h-6" 
                style={{ color: colors.primary }} 
              />
            </div>
            <div>
              <p 
                className="font-medium"
                style={{ color: colors.text }}
              >
                {userData.name}
              </p>
              <p 
                className="text-sm"
                style={{ color: colors.textMuted }}
              >
                {userData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown and Actions */}
        <div 
          className={`space-y-6 transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Countdown Display */}
          <div 
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg"
            style={{ 
              background: `${colors.primary}10`,
              border: `1px solid ${colors.primary}20`
            }}
          >
            <Timer 
              className="w-4 h-4 animate-pulse" 
              style={{ color: colors.primary }} 
            />
            <span 
              className="text-sm font-medium"
              style={{ color: colors.primary }}
            >
              Redirigiendo al login en {countdown} segundos
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleGoToLogin}
            variant="primary"
            size="lg"
            className="w-full group"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}90)`,
              boxShadow: isDark ? `0 0 20px ${colors.primary}30` : `0 4px 15px ${colors.primary}30`
            }}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Ir al Login Ahora</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>

          {/* Secondary Link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium transition-colors duration-300 hover:underline"
              style={{ 
                color: colors.textMuted,
              }}
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div 
            className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 transition-all duration-1000 ${
              isVisible ? 'scale-100' : 'scale-0'
            }`}
            style={{
              background: `radial-gradient(circle, ${colors.primary}40, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
          <div 
            className={`absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-15 transition-all duration-1000 delay-300 ${
              isVisible ? 'scale-100' : 'scale-0'
            }`}
            style={{
              background: `radial-gradient(circle, ${colors.primary}30, transparent 70%)`,
              filter: 'blur(15px)'
            }}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserCreatedPage;