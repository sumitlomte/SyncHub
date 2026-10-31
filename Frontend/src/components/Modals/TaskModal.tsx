import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "../../types/task";
import useUsers from "../../hook/use-user";
import { taskFormSchema, type TaskFormValues } from "../../schemas/task.schema";

export type TaskFormData = TaskFormValues;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  onDelete?: (id: string) => void;
  task?: Task | null;
  isLoading?: boolean;
};

const emptyValues: TaskFormData = {
  title: "",
  description: "",
  status: "TODO",
  dueDate: "",
  assignedTo: "",
  projectId: "",
};

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  task,
  isLoading = false,
}: Props) {
  const { GetAllUsers } = useUsers({ fetchAllUsers: true });
  const { data: users } = GetAllUsers;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    reset(
      task
        ? {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate
              ? new Date(task.dueDate).toISOString().split("T")[0]
              : "",
            assignedTo:
              task.assignedUserId ||
              (task.assignedTo === "Unassigned" ? "" : task.assignedTo) ||
              "",
            projectId: task.projectId,
            assignee: task.assignee,
          }
        : emptyValues,
    );
  }, [open, reset, task]);

  const submitForm = (values: TaskFormData) => {
    onSubmit(values);
    onClose();
  };

  const submitting = isLoading || isSubmitting;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="app-dialog"
      aria-labelledby="task-dialog-title"
    >
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <DialogTitle id="task-dialog-title">
          {task ? "Edit Task" : "Create Task"}
          <p className="app-dialog__subtitle">
            {task
              ? "Update task details, ownership, or status."
              : "Describe the work and assign it to a teammate."}
          </p>
        </DialogTitle>
        <DialogContent>
          <div className="app-dialog__form">
            <TextField
              label="Title"
              fullWidth
              className="app-dialog__field"
              placeholder="What needs to be done?"
              disabled={submitting}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />

            <TextField
              label="Description"
              fullWidth
              className="app-dialog__field"
              placeholder="Add more details..."
              multiline
              rows={4}
              disabled={submitting}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />

            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Assign To"
                  fullWidth
                  className="app-dialog__field"
                  disabled={submitting}
                  {...field}
                >
                  <MenuItem value="">Select Assignee</MenuItem>
                  {users?.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  fullWidth
                  className="app-dialog__field"
                  disabled={submitting}
                  {...field}
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </TextField>
              )}
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              className="app-dialog__field"
              disabled={submitting}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              {...register("dueDate")}
            />
          </div>
        </DialogContent>
        <DialogActions className="app-dialog__actions">
          {task && onDelete && (
            <Button
              className="app-button-danger"
              onClick={() => {
                if (confirm("Are you sure you want to delete this task?")) {
                  onDelete(task.id);
                  onClose();
                }
              }}
              disabled={submitting}
            >
              Delete
            </Button>
          )}
          {task && onDelete && <span className="app-dialog__footer-spacer" />}
          <Button
            variant="outlined"
            className="app-button-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            className="app-button-primary"
            type="submit"
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {submitting ? "Saving..." : task ? "Update Task" : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
