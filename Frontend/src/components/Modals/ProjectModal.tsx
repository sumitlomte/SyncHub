import { Modal, Box, TextField, Button } from "@mui/material"
import { startTransition, useEffect, useState } from "react"

type Project = {
  id?: string
  title: string
  description: string
  userId?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (formData: Project) => void
  project?: Project | null
}

export default function ProjectModal({ open, onClose, onSubmit, project }: Props) {

  const [form, setForm] = useState<Project>({
    title: "",
    description: "",
  })

  useEffect(() => {
    startTransition(() => {
      if (project) {
        setForm(project)
      } else {
        setForm({ title: "", description: "" })
      }
    })
  }, [project])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    onSubmit(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <div className="flex flex-col gap-4">

          <TextField
            label="Project Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSubmit}>
              {project ? "Update" : "Create"}
            </Button>
          </div>

        </div>

      </Box>
    </Modal>
  )
}
