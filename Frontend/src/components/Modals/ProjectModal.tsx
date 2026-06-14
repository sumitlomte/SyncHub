import { Modal, Box, TextField, Button, FormHelperText } from "@mui/material"
import { useEffect } from "react"
import { useFormValidation, projectFormValidator } from "../../hook/use-form-validation"

export type ProjectFormData = {
  id?: string
  title: string
  description: string
  userId?: string
}

type Project = ProjectFormData

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (formData: Project) => void
  project?: Project | null
}

export default function ProjectModal({ open, onClose, onSubmit, project }: Props) {

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useFormValidation({
    initialValues: {
      title: "",
      description: "",
    },
    validate: projectFormValidator,
    onSubmit: (data) => {
      onSubmit(data as Project)
      onClose()
    },
  })

  useEffect(() => {
    if (project) {
      setValues({
        id: project.id,
        title: project.title,
        description: project.description,
        userId: project.userId,
      })
    } else {
      setValues({
        title: "",
        description: "",
      })
    }
  }, [project, setValues])

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <TextField
              label="Project Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
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
              multiline
              rows={4}
              error={!!(touched.description && errors.description)}
            />
            {touched.description && errors.description && (
              <FormHelperText error>{errors.description}</FormHelperText>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : project ? "Update" : "Create"}
            </Button>
          </div>

        </form>

      </Box>
    </Modal>
  )
}
