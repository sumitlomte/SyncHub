import { FaFolder, FaTasks, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { Link, useLocation } from '@tanstack/react-router'
import { router } from "./../router"
import useUsers from "../hook/use-user";


export default function SideNav() {
  const { LogoutUser } = useUsers();
  const location = useLocation();
  // Update active item based on current location
  const isUsersActive = location.pathname.includes("/users");
  const isTasksActive = location.pathname.includes("/tasks");
  const isProjectsActive = location.pathname.includes("/projects");
  const isDashboardActive = location.pathname === "/dashboard";

  const handleLogout = () => {
    LogoutUser.mutate();
    router.navigate({ to: "/login" }); // Redirect to login page after logout
  };

  return (
    <div className="w-30 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo / App Name */}
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold">ChatTasker</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col justify-between mt-4 h-full">
        <div className="flex flex-col space-y-2">
            <Link to="/dashboard">
              <button
                className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200 
                  ${isDashboardActive ? "bg-gray-700" : "hover:bg-gray-800"}`}
              >
                <TbLayoutDashboard className="w-6 h-6 mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>
            </Link>

            <Link to="/projects">
              <button
                className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200 
                  ${isProjectsActive ? "bg-gray-700" : "hover:bg-gray-800"}`} 
              >
                <FaFolder className="w-4 h-4 mr-3" />
                <span className="font-medium">Projects</span>
              </button>
            </Link>
            <Link to="/tasks">
              <button
                className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200
                  ${isTasksActive ? "bg-gray-700" : "hover:bg-gray-800"}`}
              >
                <FaTasks className="w-3.5 h-3.5 mr-3" />
                <span className="font-medium">Tasks</span>
              </button>
            </Link>
            <Link to="/users">
              <button
                className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200
                ${isUsersActive ? "bg-gray-700" : "hover:bg-gray-800"}`}
              >
                <FaUsers className="w-4 h-4 mr-3" />
                <span className="font-medium">Users</span>
              </button>
            </Link>
        </div>
        <div>
            <p >
              <button
                  className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200 bg-gray-700 `}
                  onClick={handleLogout}
              >
                  <FaSignOutAlt className="w-5 h-5 mr-3" />
                  <span className="font-medium">LOGOUT</span>
              </button>
            </p>
        </div>
      </nav>
    </div>
  );
}