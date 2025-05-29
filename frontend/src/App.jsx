import { useState, useEffect } from 'react';
import AuthSystem from './components/login';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import Admin from './components/admin';
import Caio from "./assets/foto-caio.jpeg";
import FunctionalitiesTable from './components/tabelaFuncionalidades/FunctionalitiesTable';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Projetos');
  const [darkMode, setDarkMode] = useState(false);
  
  const [user, setUser] = useState({
    name: "Caio Henrique",
    photo: Caio,
    role: "QA Engineer"
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogout = () => {};

  return (
    <Admin
      user={user}
      currentView={currentView}
      setCurrentView={setCurrentView}
      handleLogout={handleLogout}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {currentView === 'Projetos' && <FunctionalitiesTable />}
      {currentView === 'Administradores' && <AuthSystem />}
      {currentView === 'historico' && <Historico />}
      {currentView === 'administradores' && <Administradores />}
    </Admin>
  );
}

export default App;
