import ProjectsList from "../../ProjectList"
import ProjectDetails from "./ProjectDetails"

export default function Projects() {

  return (
     <div className="flex h-screen">
        <div className="flex-[0.7] flex-col border-r border-gray-400">
          <ProjectsList />
        </div>
        <div className="flex-[1.4] ">
          <ProjectDetails />
        </div>
      </div>
  )
}