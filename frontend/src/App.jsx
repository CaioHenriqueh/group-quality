import { useState } from 'react'
import AuthSystem from './components/login'
import ProjectsPage from './components/ProjectsPage/ProjectsPage'
import Admin from './components/admin'
import Caio from "./assets/foto-caio.jpeg"
import './App.css'


function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({
    name: "Caio Henrique",
    photo: Caio,
    role: "QA Engineer"
  });

  const handleLogout = () => {
  };

  return (
    // <AuthSystem/>
    <Admin
      user={user}
      currentView={currentView}
      setCurrentView={setCurrentView}
      handleLogout={handleLogout}
    >
      {currentView === 'dashboard' && <ProjectsPage />}
      {currentView === 'testes' && <Admin />}
      {currentView === 'historico' && <Historico />}
      {currentView === 'administradores' && <Administradores />}
    </Admin>
  );
}
export default App
