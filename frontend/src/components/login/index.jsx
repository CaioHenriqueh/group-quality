import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './login.css';

const AuthSystem = () => {
  const [activeView, setActiveView] = useState('login');

  return (
    <div className="auth-system">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            opacity: Math.random() * 0.5 + 0.1,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>
      
      {activeView === 'login' && <LoginView goToView={setActiveView} />}
      {activeView === 'forgot' && <ForgotPasswordView goToView={setActiveView} />}
      {activeView === 'register' && <RegisterView goToView={setActiveView} />}
    </div>
  );
};

const LoginView = ({ goToView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Bem-vindo ao OnTestPlan, ${email}!`);
    }, 1500);
  };

  return (
    <AuthCard>
      <div className="logo-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          On<span>Test</span>Plan
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Plataforma de planejamento de testes automatizados
        </motion.p>
      </div>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<FaEnvelope />}
        />

        <div className="password-input">
          <InputField
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<FaLock />}
          />
          <button 
            type="button" 
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="auth-actions">
          <button type="button" className="link-button" onClick={() => goToView('forgot')}>
            Esqueceu a senha?
          </button>
        </div>

        <SubmitButton loading={isLoading}>
          {isLoading ? 'Carregando...' : 'Entrar'}
        </SubmitButton>

        <div className="auth-footer">
          <span>Novo no OnTestPlan?</span>
          <button 
            type="button" 
            className="link-button" 
            onClick={() => goToView('register')}
          >
            Criar conta
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

const ForgotPasswordView = ({ goToView }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      goToView('login');
    }, 3000);
  };

  return (
    <AuthCard>
      <motion.button 
        className="back-button" 
        onClick={() => goToView('login')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Voltar
      </motion.button>

      <div className="logo-header">
        <h1>Recuperar Senha</h1>
        <p>Digite seu email para receber o link de recuperação</p>
      </div>

      {isSent ? (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p>Email enviado com sucesso!</p>
          <p>Verifique sua caixa de entrada.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<FaEnvelope />}
          />

          <SubmitButton>
            Enviar Link
          </SubmitButton>
        </form>
      )}
    </AuthCard>
  );
};

const RegisterView = ({ goToView }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Conta criada com sucesso para ${formData.name}!`);
      goToView('login');
    }, 1500);
  };

  return (
    <AuthCard>
      <motion.button 
        className="back-button" 
        onClick={() => goToView('login')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Voltar
      </motion.button>

      <div className="logo-header">
        <h1>Criar Conta</h1>
        <p>Junte-se ao OnTestPlan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Nome Completo"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          icon={<FaUser />}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={<FaEnvelope />}
        />

        <div className="password-input">
          <InputField
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            icon={<FaLock />}
          />
          <button 
            type="button" 
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <InputField
          label="Confirmar Senha"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          icon={<FaLock />}
        />

        <SubmitButton loading={isLoading}>
          {isLoading ? 'Criando conta...' : (
            <>
              <FaUserPlus /> Criar Conta
            </>
          )}
        </SubmitButton>

        <div className="auth-footer">
          <span>Já tem uma conta?</span>
          <button type="button" className="link-button" onClick={() => goToView('login')}>
            Fazer login
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

// Componentes Reutilizáveis
const AuthCard = ({ children }) => (
  <motion.div 
    className="auth-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const InputField = ({ label, icon, ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <div className="input-container">
      {icon && <span className="input-icon">{icon}</span>}
      <input {...props} />
    </div>
  </div>
);

const SubmitButton = ({ children, loading = false }) => (
  <motion.button 
    type="submit" 
    className={`submit-button ${loading ? 'loading' : ''}`}
    disabled={loading}
    whileHover={{ scale: loading ? 1 : 1.03 }}
    whileTap={{ scale: loading ? 1 : 0.98 }}
  >
    {children}
  </motion.button>
);

export default AuthSystem;