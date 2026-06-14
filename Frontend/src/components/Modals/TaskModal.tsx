import { Modal, Box, TextField, Button, MenuItem, CircularProgress, FormHelperText } from "@mui/material"
import { useEffect } from "react"
import type { Task } from "../../types/task"
import useUsers from "../../hook/use-user"
import { useFormValidation } from "../../hook/use-form-validation"

type TaskFormData = {
  id?: string
  title: string
  description: string
  projectId?: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  dueDate?: Date | string
  assignedTo?: string
  assignee?: string
  assignedUserId?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  onDelete?: (id: string) => void
  task?: Task | null
  isLoading?: boolean
}

export default function TaskModal({ open, onClose, onSubmit, onDelete, task, isLoading = false }: Props) {

  const { GetAllUsers } = useUsers()
  const { data: users } = GetAllUsers

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useFormValidation({
    initialValues: {
      title: "",
      description: "",
      status: "TODO",
      dueDate: "",
      assignedTo: "",
      projectId: "",
    },
    validate: (formValues) => {
      // Custom validation for task
      const errors: Record<string, string> = {}
      
      if (!formValues.title || typeof formValues.title !== "string" || !formValues.title.trim()) {
        errors.title = "Title is required"
      }
      
      if (formValues.description && typeof formValues.description === "string" && formValues.description.length > 500) {
        errors.description = "Description must be less than 500 characters"
      }
      
      return errors
    },
    onSubmit: (data) => {
      onSubmit(data as TaskFormData)
      onClose()
    },
  })

  useEffect(() => {
    if (task) {
      setValues({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        assignedTo: task.assignedUserId || (task.assignedTo === "Unassigned" ? "" : task.assignedTo) || "",
        projectId: task.projectId,
        assignee: task.assignee,
      })
    } else {
      setValues({
        title: "",
        description: "",
        status: "TODO",
        dueDate: "",
        assignedTo: "",
        projectId: "",
      })
    }
  }, [task, setValues])

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-lg max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-2">
          {task ? "Edit Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div>
            <TextField
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              size="small"
              placeholder="What needs to be done?"
              disabled={isLoading || isSubmitting}
              error={!!(touched.title && errors.title)}
            />
            {touched.title && errors.title && (
              <FormHelperText error>{errors.title}</FormHelperText>
            )}
          </div>

          <div>
            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              size="small"
              placeholder="Add more details..."
              multiline
              rows={4}
              disabled={isLoading || isSubmitting}
              error={!!(touched.description && errors.description)}
            />
            {touched.description && errors.description && (
              <FormHelperText error>{errors.description}</FormHelperText>
            )}
          </div>

          <TextField
            select
            label="Assign To"
            name="assignedTo"
            value={values.assignedTo}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            size="small"
            disabled={isLoading || isSubmitting}
          >
            <MenuItem value="">Select Assignee</MenuItem>
            {users?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            size="small"
            disabled={isLoading || isSubmitting}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </TextField>

          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            size="small"
            disabled={isLoading || isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button 
              variant="outlined" 
              onClick={onClose}
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </Button>

            {task && onDelete && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(task.id)
                    onClose()
                  }
                }}
                disabled={isLoading || isSubmitting}
              >
                Delete
              </Button>
            )}

            <Button 
              variant="contained" 
              type="submit"
              disabled={isLoading || isSubmitting}
              startIcon={(isLoading || isSubmitting) && <CircularProgress size={20} />}
            >
              {isLoading || isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </div>

        </form>

      </Box>
    </Modal>
  )
}
