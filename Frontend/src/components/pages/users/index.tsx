import UserList from "./../../UserList";
import AssignedProjects from "./../../AssignedProjects";

export default function Users() {
    return (
        <div className="flex h-screen">
            <div className="flex-[0.7] flex-col border-r border-gray-400">
                <UserList />
            </div>
            <div className="flex-[1.4] ">
                <AssignedProjects />
            </div>
        </div>
    )
}
