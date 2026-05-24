import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button, CircularProgress } from "@mui/material"
import { Trash2, Edit, Plus, ChevronRight } from "lucide-react"
import useProjects from "../hook/use-project"
import { userStore } from "../store/user-store"
import ProjectModal from "./Modals/ProjectModal"
import type { Project } from "../Types/project"

export default function ProjectList() {
  const navigate = useNavigate()
  const { GetAllProjectsByUserID, CreateProject, UpdateProject, DeleteProject } = useProjects()
  const { data: projects = [] } = GetAllProjectsByUserID
  const { user } = userStore.get()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleAddProject = () => {
    setSelectedProject(null)
    setModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      DeleteProject.mutate(projectId)
    }
  }

  const handleSubmitProject = (formData: Project) => {
    if (selectedProject) {
      UpdateProject.mutate({
        id: selectedProject.id!,
        title: formData.title,
        description: formData.description,
      })
    } else {
      CreateProject.mutate({
        title: formData.title,
        description: formData.description,
        userId: user?.id || "",
      })
    }
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{projects.length} Projects</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={handleAddProject}
        >
          Add Project
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No projects found.</p>
            <p className="text-sm mt-2">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="max-h-[82vh] overflow-y-auto p-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate({ to: `/projects/${project.id}` })}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 break-words group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line break-words line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit size={16} />}
                      onClick={() => handleEditProject(project)}
                      disabled={UpdateProject.isPending}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={
                        DeleteProject.isPending ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )
                      }
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={DeleteProject.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
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
  )
}
