import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import './login.css';

const AuthSystem = () => {
  const [activeView, setActiveView] = useState('login');
  
  return (
    <div className="auth-system">
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
        <h1>On<span>Test</span>Plan</h1>
        <p>Plataforma de testes automatizados</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          value={email}
          placeholder="sadas"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="password-input">
          <InputField
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <button type="button" className="link-button" onClick={() => goToView('register')}>
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
      <button className="back-button" onClick={() => goToView('login')}>
        <FaArrowLeft /> Voltar
      </button>
      
      <div className="logo-header">
        <h1>Recuperar Senha</h1>
        <p>Digite seu email para receber o link de recuperação</p>
      </div>
      
      {isSent ? (
        <div className="success-message">
          <p>Email enviado com sucesso!</p>
          <p>Verifique sua caixa de entrada.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
      <button className="back-button" onClick={() => goToView('login')}>
        <FaArrowLeft /> Voltar
      </button>
      
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
        />
        
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <div className="password-input">
          <InputField
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
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
  <div className="auth-card">
    {children}
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <input {...props} />
  </div>
);

const SubmitButton = ({ children, loading = false }) => (
  <button 
    type="submit" 
    className={`submit-button ${loading ? 'loading' : ''}`}
    disabled={loading}
  >
    {children}
  </button>
);

export default AuthSystem;