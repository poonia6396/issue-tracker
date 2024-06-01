import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProjectList.module.css";

interface Project {
  id: number;
  name: string;
}

interface Props {
  projects: Project[];
}

const ProjectList: React.FC<Props> = ({ projects }) => {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id} className={styles.project}>
          <h2>{project.name}</h2>
          <Link to={`/project/${project.id}/issues`} className={styles.link}>
            View Issues
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;