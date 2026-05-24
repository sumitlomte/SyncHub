import { useParams } from "@tanstack/react-router";
import useUsers from "../hook/use-user";
import type { AssignedProjects } from "../Types/user";

export default function AssignedProjects() {

  const { userId } = useParams({ strict: false });
  const { GetAssignedProjects } = useUsers();
  const { data: AssignedProjects = [] } = GetAssignedProjects(userId);

  return (
    <div className="w-full p-6">

      {!userId ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">No User Selected</h2>
          <p>Please select a user to view assigned projects.</p>
        </div>
      ) : (
        <div>

          {/* Header */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Assigned Projects
          </h2>

          {/* No projects */}
          {AssignedProjects.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-gray-500">
              No projects assigned to this user.
            </div>
          ) : (

            /* Project Grid */
        <div className="w-full">

            <div className="w-full h-[80vh] flex flex-col gap-4 overflow-y-auto">
                {AssignedProjects.map((project) => (
                    <div
                    key={project.id}
                    className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition w-full"
                    >
                    <h3 className="text-lg font-semibold">{project.title}</h3>

                    <p className="text-sm text-gray-500 mt-1 mb-4">
                        {project.description}
                    </p>

                    <div className="grid grid-cols-4 gap-3 w-full text-center">

                        <div className="bg-gray-100 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold">{project.totalTasks}</p>
                        </div>

                        <div className="bg-yellow-100 rounded-lg p-2">
                        <p className="text-xs text-yellow-700">Todo</p>
                        <p className="font-semibold">{project.todoTasks}</p>
                        </div>

                        <div className="bg-blue-100 rounded-lg p-2">
                        <p className="text-xs text-blue-700">Progress</p>
                        <p className="font-semibold">{project.inProgressTasks}</p>
                        </div>

                        <div className="bg-green-100 rounded-lg p-2">
                        <p className="text-xs text-green-700">Done</p>
                        <p className="font-semibold">{project.completedTasks}</p>
                        </div>

                    </div>
                    </div>
                ))}
            </div>

        </div>
          )}
        </div>
      )}
    </div>
  );
}