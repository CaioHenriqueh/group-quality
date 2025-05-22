import React, { useState } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="project-card-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="project-card">
                {/* Efeito de brilho dinâmico */}
                <div className={`card-glow ${isHovered ? 'active' : ''}`}></div>
                
                {/* Imagem redonda com borda animada */}
                <div className="project-image-wrapper">
                    <img
                        src={project.image || 'https://source.unsplash.com/random/200x200/?tech,app'}
                        alt={project.name}
                        className="project-image"
                    />
                    <div className="image-border"></div>
                </div>
                
                {/* Conteúdo principal */}
                <div className="project-content">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    
                    {/* Divider estilizado */}
                    <div className="project-divider">
                        <span className="divider-line"></span>
                    </div>
                    
                    {/* Footer com animação */}
                    <div className="project-footer">
                        <span className="project-badge">TEST PLANNING</span>
                        <span className="project-cta">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;