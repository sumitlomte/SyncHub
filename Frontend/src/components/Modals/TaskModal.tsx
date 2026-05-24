import { Modal, Box, TextField, Button, MenuItem, CircularProgress } from "@mui/material"
import { startTransition, useEffect, useState } from "react"
import type { Task } from "../../Types/task"
import useUsers from "../../hook/use-user"

type TaskFormData = {
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  dueDate?: Date
  assignedTo?: string
  assignee?: string
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

  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "TODO",
    dueDate: undefined,
  })

  useEffect(() => {
    startTransition(() => {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          assignedTo: task.assignedUserId || (task.assignedTo === 'Unassigned' ? "" : task.assignedTo) || "",
        })
      } else {
        setForm({ title: "", description: "", status: "TODO", dueDate: undefined, assignedTo: "" })
      }
    })
  }, [task])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      dueDate: e.target.value ? new Date(e.target.value) : undefined,
    })
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Please enter a title")
      return
    }
    onSubmit(form)
    onClose()
  }

  const formatDateForInput = (date?: Date) => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0]
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-lg max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-2">
          {task ? "Edit Task" : "Create Task"}
        </h2>

        <div className="flex flex-col gap-3">

          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="What needs to be done?"
            disabled={isLoading}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="Add more details..."
            multiline
            rows={4}
            disabled={isLoading}
          />

          <TextField
            select
            label="Assign To"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={isLoading}
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
            value={form.status}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={isLoading}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </TextField>

          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formatDateForInput(form.dueDate)}
            onChange={handleDateChange}
            fullWidth
            size="small"
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button 
              variant="outlined" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {task && onDelete && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id)
                    onClose()
                  }
                }}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}

            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>

        </div>

      </Box>
    </Modal>
  )
}
