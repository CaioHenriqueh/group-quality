import { useState } from 'react'
import AuthSystem from './components/login'
import ProjectsPage from './components/ProjectsPage/ProjectsPage'
import Admin from './components/admin'
import Caio from "./assets/foto-caio.jpeg"
import FunctionalitiesTable from './components/tabelaFuncionalidades/FunctionalitiesTable'
import './App.css'


function App() {
  const [currentView, setCurrentView] = useState('Projetos');
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
      {currentView === 'Projetos' && <FunctionalitiesTable />}
      {currentView === 'Administradores' && <AuthSystem />}
      {currentView === 'historico' && <Historico />}
      {currentView === 'administradores' && <Administradores />}
    </Admin>
  );
}
export default App
