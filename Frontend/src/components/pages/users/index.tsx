import UserList from "./../../UserList";
import AssignedProjects from "./../../AssignedProjects";
import { useParams } from "@tanstack/react-router";

export default function Users() {
  const { userId } = useParams({ strict: false });

  return (
    <div className="flex h-full min-h-0">
      <div
        className={`${userId ? "hidden md:flex" : "flex"} min-w-0 flex-1 flex-col border-r border-gray-200 md:flex-[0.7]`}
      >
        <UserList />
      </div>
      <div
        className={`${userId ? "flex" : "hidden md:flex"} min-w-0 flex-1 md:flex-[1.4]`}
      >
        <AssignedProjects />
      </div>
    </div>
  );
}
