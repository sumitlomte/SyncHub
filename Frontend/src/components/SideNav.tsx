import { FaFolder, FaTasks, FaUsers, FaSignOutAlt, FaSync } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { Link, useLocation } from '@tanstack/react-router'
import { router } from "./../router"
import useUsers from "../hook/use-user";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useState } from "react";

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  key: "dashboard" | "projects" | "tasks" | "users";
}

const NavButton = ({ to, icon, label, isActive, isExpanded }: NavButtonProps) => (
  <Link to={to}>
    <button
      className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200 
        ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} ${!isExpanded ? "justify-center" : ""}`}
      title={isExpanded ? "" : label}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      {isExpanded && <span className="font-medium ml-3 whitespace-nowrap">{label}</span>}
    </button>
  </Link>
);

export default function SideNav() {
  const { LogoutUser } = useUsers();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Update active item based on current location
  const isUsersActive = location.pathname.includes("/users");
  const isTasksActive = location.pathname.includes("/tasks");
  const isProjectsActive = location.pathname.includes("/projects");
  const isDashboardActive = location.pathname === "/dashboard";

  const activeStates = {
    dashboard: isDashboardActive,
    projects: isProjectsActive,
    tasks: isTasksActive,
    users: isUsersActive,
  };

  const navItems: NavItem[] = [
    {
      key: "dashboard",
      to: "/dashboard",
      icon: <TbLayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      key: "projects",
      to: "/projects",
      icon: <FaFolder className="w-4 h-4" />,
      label: "Projects",
    },
    {
      key: "tasks",
      to: "/tasks",
      icon: <FaTasks className="w-4 h-4" />,
      label: "Tasks",
    },
    {
      key: "users",
      to: "/users",
      icon: <FaUsers className="w-4 h-4" />,
      label: "Users",
    },
  ];

  const handleLogout = async () => {
    try {
      // Call the mutation - it will handle cache clearing in onSuccess
      
      
      await LogoutUser.mutateAsync();
      
      // Navigate to login after mutation completes
      router.navigate({ to: "/login" });
    } catch {
      // Mutation error handler already displays toast
      // Still navigate to login on error
      router.navigate({ to: "/login" });
    }
  };

  return (
    <div className={`${isExpanded ? "w-38" : "w-15"} h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Logo / App Name */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between gap-2 group">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <FaSync className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">SyncHub</h2>
          </div>
        )}
        {!isExpanded && (
          <div className="w-6 h-6 mx-auto flex items-center justify-center">
            <FaSync className="w-6 h-6 text-blue-400 group-hover:hidden" />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden group-hover:block p-1 hover:bg-gray-700 rounded transition-colors"
              title="Expand sidebar"
            >
              <GoSidebarExpand className="w-5 h-5" />
            </button>
          </div>
        )}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            title="Collapse sidebar"
          >
            <GoSidebarCollapse className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col justify-between mt-4 h-full">
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={activeStates[item.key]}
              isExpanded={isExpanded}
            />
          ))}
        </div>
        <div>
          <button
            className={`flex items-center w-full px-2 py-2 text-left transition-colors duration-200 bg-gray-700 hover:bg-gray-600 ${!isExpanded ? "justify-center" : ""}`}
            onClick={handleLogout}
            title={isExpanded ? "" : "Logout"}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <FaSignOutAlt className="w-5 h-5" />
            </div>
            {isExpanded && <span className="font-medium ml-3 whitespace-nowrap">LOGOUT</span>}
          </button>
        </div>
      </nav>
    </div>
  );
}