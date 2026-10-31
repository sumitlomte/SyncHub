import { useState } from "react";
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import useProjects from "../../../hook/use-project";
import useTasks from "../../../hook/use-task";
import { userStore } from "../../../store/Auth-store";
import TaskModal from "../../Modals/TaskModal";
import type { Task } from "../../../types/task";
import type { ProjectItem } from "../../../types/project";

interface TaskFormData {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: Date | string;
  assignedTo?: string;
}

type TeamMemberData = {
  id?: string;
  name?: string;
};

const COLUMNS = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;
const COLUMN_LABELS: Record<"TODO" | "IN_PROGRESS" | "COMPLETED", string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function Task() {
  const { GetAllProjectsList } = useProjects(true, false);
  const { user } = userStore.get();

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const { data: projects = [], isLoading: projectsLoading } =
    GetAllProjectsList;

  const { GetTasksByProjectId, CreateTask, UpdateTask, DeleteTask } = useTasks(
    selectedProject?.id || "",
  );
  const { data: tasks = [], isPending, isError } = GetTasksByProjectId;

  const openCreateModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }
    setSelectedTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (formData: TaskFormData) => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    if (selectedTask?.id) {
      // Edit mode
      UpdateTask.mutate({
        id: selectedTask.id,
        task: {
          id: selectedTask.id,
          title: formData.title,
          description: formData.description,
          projectId: selectedProject.id,
          assignee: selectedTask.assigneeId || selectedTask.assignee,
          assignedTo:
            formData.assignedTo ||
            selectedTask.assignedUserId ||
            selectedTask.assignedTo,
          status: formData.status,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate)
            : selectedTask.dueDate,
        },
      });
    } else {
      // Create mode
      CreateTask.mutate({
        title: formData.title,
        description: formData.description,
        projectId: selectedProject.id,
        assignee: user?.id || "",
        assignedTo: formData.assignedTo || "Unassigned",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      DeleteTask.mutate(id);
    }
  };

  const handleProjectSelect = (project: ProjectItem) => {
    setSelectedProject(project);
    setSelectedAssignee(null); // Reset the filter when project changes
    setModalOpen(false);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: "TODO" | "IN_PROGRESS" | "COMPLETED",
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.id && task.status !== newStatus && selectedProject) {
      UpdateTask.mutate({
        id: task.id,
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          projectId: selectedProject.id,
          assignee: task.assigneeId || task.assignee,
          assignedTo: task.assignedUserId || task.assignedTo,
          status: newStatus,
          dueDate: task.dueDate,
        },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
  ) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  function getInitials(fullName: string): string {
    const parts = fullName.trim().split(" ");

    if (parts.length >= 2) {
      // First char of first name + first char of surname
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      const name = parts[0];
      // If only one word, take first + last char
      return (name[0] + name[name.length - 1]).toUpperCase();
    }
  }

  const teamMembers = selectedProject?.teamMembers || [];

  const filteredTasks = tasks.filter((task) => {
    if (!selectedAssignee) return true;
    if (selectedAssignee === "Unassigned") {
      return !task.assignedTo || task.assignedTo === "Unassigned";
    }
    return (
      task.assignedTo === selectedAssignee ||
      task.assignedUserId === selectedAssignee
    );
  });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* TOP BAR - PROJECT SELECTOR & HEADER */}
      <div className="task-page-header relative border-b border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <CheckCircle size={20} />
              </div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                TaskSpace
              </h1>
            </div>

            {/* Project Selector */}
            <div className="flex min-w-0 items-center gap-2 sm:ml-6 sm:border-l sm:border-slate-200 sm:pl-6">
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                Project:
              </span>
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                type="button"
                aria-expanded={showProjectDropdown}
                aria-controls="task-project-dropdown"
                className={`task-project-selector ${
                  selectedProject ? "is-selected" : ""
                }`}
              >
                <span className="task-project-selector__indicator" />
                <span className="max-w-36 truncate text-xs font-semibold sm:max-w-56 sm:text-sm">
                  {selectedProject?.title || "Select a project"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    showProjectDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>

            {/* Team Members */}
            {selectedProject && (
              <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:ml-2 sm:flex">
                <span className="text-sm text-slate-500 font-medium">
                  Team:
                </span>
                <div className="flex -space-x-2">
                  <button
                    type="button"
                    aria-label="Filter unassigned tasks"
                    aria-pressed={selectedAssignee === "Unassigned"}
                    onClick={() =>
                      setSelectedAssignee(
                        selectedAssignee === "Unassigned" ? null : "Unassigned",
                      )
                    }
                    className={`task-member-filter relative z-0 flex items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm transition-transform hover:z-10 hover:scale-110 ${
                      selectedAssignee === "Unassigned"
                        ? "bg-indigo-600 text-white border-indigo-600 z-10"
                        : "bg-slate-100 text-slate-500 border-white ring-1 ring-slate-900/5"
                    }`}
                    title="Unassigned"
                  >
                    UA
                  </button>
                  {teamMembers
                    .slice(0, 5)
                    .map((rawMember: unknown, idx: number) => {
                      const member = rawMember as TeamMemberData | string;
                      const memberName =
                        typeof member === "string"
                          ? "User"
                          : member.name || "User";
                      const memberId =
                        typeof member === "string"
                          ? member
                          : member.id || String(idx);

                      const isSelected =
                        selectedAssignee === memberName ||
                        selectedAssignee === memberId;

                      return (
                        <button
                          key={memberId}
                          type="button"
                          aria-label={`Filter tasks assigned to ${memberName}`}
                          aria-pressed={isSelected}
                          onClick={() =>
                            setSelectedAssignee(isSelected ? null : memberName)
                          }
                          className={`task-member-filter relative z-0 flex items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm transition-transform hover:z-10 hover:scale-110 ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 z-10"
                              : "bg-indigo-100 text-indigo-700 border-white ring-1 ring-slate-900/5"
                          }`}
                          title={memberName}
                        >
                          {getInitials(memberName)}
                        </button>
                      );
                    })}
                  {teamMembers.length > 5 && (
                    <div
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm ring-1 ring-slate-900/5 z-0"
                      title={`${teamMembers.length - 5} more members`}
                    >
                      +{teamMembers.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openCreateModal}
            disabled={!selectedProject}
            type="button"
            className="app-button-primary shrink-0 text-xs sm:text-sm"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>

        {/* Project Dropdown */}
        {showProjectDropdown && (
          <div
            id="task-project-dropdown"
            className="task-project-dropdown absolute left-3 right-3 top-full z-50 overflow-y-auto px-3 py-2 sm:left-1/2 sm:right-auto sm:w-80 sm:-translate-x-1/2"
          >
            {projectsLoading ? (
              <div className="py-6">
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="task-project-skeleton space-y-2 rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="task-project-skeleton__shimmer h-8 w-8 animate-pulse rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="task-project-skeleton__shimmer h-4 w-32 animate-pulse rounded" />
                          <div className="task-project-skeleton__shimmer h-3 w-48 animate-pulse rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6">
                <AlertCircle
                  className="task-project-empty-icon mx-auto mb-2"
                  size={32}
                />
                <p className="task-project-empty-text text-xs font-medium">
                  No projects found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      handleProjectSelect(project as unknown as ProjectItem);
                      setShowProjectDropdown(false);
                    }}
                    className={`task-project-option ${
                      selectedProject?.id === project.id ? "is-selected" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="task-project-option__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                        {project.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="task-project-option__title truncate text-xs font-semibold">
                          {project.title}
                        </h4>
                        <p className="task-project-option__description line-clamp-1 text-xs">
                          {project.description || "No description"}
                        </p>
                      </div>
                      {selectedProject?.id === project.id && (
                        <svg
                          className="task-project-option__check h-4 w-4 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Board View */}
        {!selectedProject ? (
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-lg text-slate-600 font-medium">
                Select a project to view tasks
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Click the project selector above to get started
              </p>
            </div>
          </main>
        ) : isPending ? (
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-3 gap-6">
                {["TODO", "IN_PROGRESS", "COMPLETED"].map((col) => (
                  <div key={col} className="space-y-3">
                    <div className="h-6 bg-neutral-200 rounded w-24 animate-pulse" />
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
                      >
                        <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 bg-neutral-200 rounded w-full animate-pulse" />
                          <div className="h-3 bg-neutral-200 rounded w-4/5 animate-pulse" />
                        </div>
                        <div className="flex justify-between pt-3 border-t border-slate-100">
                          <div className="h-3 bg-neutral-200 rounded w-20 animate-pulse" />
                          <div className="w-6 h-6 rounded-full bg-neutral-200 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : isError ? (
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-lg text-red-600 font-medium">
                Failed to load tasks
              </p>
              <p className="text-sm text-red-500 mt-2">
                Please try again or select a different project
              </p>
            </div>
          </main>
        ) : (
          <main className="flex-1 min-h-0 overflow-x-auto bg-slate-50 p-3 flex gap-3 sm:gap-6 sm:p-6">
            {COLUMNS.map((col) => {
              const columnTasks = filteredTasks.filter((t) => t.status === col);
              return (
                <div
                  key={col}
                  className="flex w-[min(84vw,20rem)] max-h-full flex-shrink-0 flex-col rounded-xl border border-slate-200/60 bg-slate-100 p-3 sm:w-80 sm:p-4"
                  onDrop={(e) => handleDrop(e, col)}
                  onDragOver={handleDragOver}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-700">
                        {COLUMN_LABELS[col]}
                      </span>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Body / Cards Stack */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        role="button"
                        tabIndex={0}
                        aria-label={`Edit task: ${task.title}`}
                        onDragStart={(e) =>
                          handleDragStart(e, task.id as string)
                        }
                        onClick={(event) => {
                          event.currentTarget.blur();
                          openEditModal(task);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.currentTarget.blur();
                            openEditModal(task);
                          }
                        }}
                        className="app-task-card cursor-pointer rounded-lg p-4 shadow-sm group focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="app-task-card__title flex-1 text-sm font-semibold leading-tight text-slate-900 transition-colors">
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={13} />
                            <span>
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No date"}
                            </span>
                          </div>
                          <div
                            className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] border border-white shadow-sm"
                            title={`Assigned to ${task.assignedTo}`}
                          >
                            {getInitials(
                              task.assignedTo !== "Unassigned"
                                ? task.assignedTo || "N/A"
                                : "N/A",
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-400">
                        No tasks yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </main>
        )}
      </div>

      {/* TASK MODAL */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        isLoading={CreateTask.isPending || UpdateTask.isPending}
      />
    </div>
  );
}
