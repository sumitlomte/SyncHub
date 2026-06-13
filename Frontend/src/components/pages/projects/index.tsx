import { Outlet, useParams } from "@tanstack/react-router"
import ProjectsList from "../../ProjectList"

export default function Projects() {
  const { projectId } = useParams({ strict: false })
  const hasSelection = Boolean(projectId)

  return (
    <div className="flex h-screen">
      {/* Project list: full width on mobile, hidden on mobile when a project is open, always visible on desktop */}
      <div
        className={`${
          hasSelection ? "hidden md:flex" : "flex"
        } w-full md:w-auto md:flex-[0.7] flex-col md:border-r border-gray-300 overflow-y-auto`}
      >
        <ProjectsList />
      </div>

      {/* Project details: hidden on mobile unless a project is selected, always visible on desktop */}
      <div
        className={`${
          hasSelection ? "flex" : "hidden md:flex"
        } w-full md:flex-[1.4] flex-col overflow-hidden bg-gray-50`}
      >
        {hasSelection ? (
          <Outlet />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <h2 className="text-xl font-bold text-gray-400">
              Select a project to view details
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}