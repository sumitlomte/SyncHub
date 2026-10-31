import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, CircularProgress } from "@mui/material";
import { Trash2, Edit, Plus } from "lucide-react";
import useProjects from "../hook/use-project";
import { userStore } from "../store/Auth-store";
import ProjectModal, { type ProjectFormData } from "./Modals/ProjectModal";
import type { Project } from "../types/project";
import { CardSkeleton } from "./ui/Skeleton";

export default function ProjectList() {
  const navigate = useNavigate();
  const {
    GetAllProjectsByUserID,
    CreateProject,
    UpdateProject,
    DeleteProject,
  } = useProjects();
  const { data: projects = [], isLoading } = GetAllProjectsByUserID;
  const { user } = userStore.get();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleAddProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setSelectedProject(null);
    setModalOpen(true);
  };

  const handleEditProject = (
    project: Project,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.currentTarget.blur();
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      DeleteProject.mutate(projectId);
    }
  };

  const handleSubmitProject = (formData: ProjectFormData) => {
    if (selectedProject) {
      UpdateProject.mutate({
        id: selectedProject.id!,
        title: formData.title,
        description: formData.description,
      });
    } else {
      CreateProject.mutate({
        title: formData.title,
        description: formData.description,
        userId: user?.id || "",
      });
    }
  };

  return (
    <div className="w-full min-h-full p-3 sm:p-6">
      <div className="flex justify-between items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {projects.length} Projects
        </h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={handleAddProject}
          className="app-button-primary !whitespace-nowrap"
        >
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        {isLoading ? (
          <div className="p-3 sm:p-4">
            <CardSkeleton count={4} />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No projects found.</p>
            <p className="text-sm mt-2">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto p-3 sm:p-4 space-y-3 md:max-h-[82vh]">
            {projects.map((project) => (
              <article
                key={project.id}
                className="app-project-card group p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="app-link min-h-11 min-w-0 flex-1 truncate text-left text-base font-semibold transition-colors sm:text-lg"
                          onClick={() =>
                            navigate({ to: `/projects/${project.id}` })
                          }
                        >
                          {project.title}
                        </button>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        className="app-button-secondary"
                        startIcon={<Edit size={16} />}
                        aria-label={`Edit ${project.title}`}
                        onClick={(event) => handleEditProject(project, event)}
                        disabled={UpdateProject.isPending}
                      >
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        className="app-button-danger"
                        startIcon={
                          DeleteProject.isPending ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )
                        }
                        aria-label={`Delete ${project.title}`}
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={DeleteProject.isPending}
                      >
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line break-words line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitProject}
        project={selectedProject}
      />
    </div>
  );
}
