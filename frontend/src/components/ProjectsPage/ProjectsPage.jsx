import React, { useState } from 'react';
import ProjectCard from '../projectCard/ProjectCard';
import AddProjectModal from '../AddProjectModal/AddProjectModal';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
    setIsModalOpen(false);
  };

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>Test Planning</h1>
        <p>A platform for managing software testing</p>
        <button 
          className="add-project-btn"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </header>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      {isModalOpen && (
        <AddProjectModal 
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;