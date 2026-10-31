import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "../../schemas/project.schema";

export type ProjectFormData = ProjectFormValues;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ProjectFormData) => void;
  project?: ProjectFormData | null;
};

const emptyValues: ProjectFormData = {
  title: "",
  description: "",
};

export default function ProjectModal({
  open,
  onClose,
  onSubmit,
  project,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(project ?? emptyValues);
  }, [open, project, reset]);

  const submitForm = (values: ProjectFormData) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="app-dialog app-dialog--compact"
      aria-labelledby="project-dialog-title"
    >
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <DialogTitle id="project-dialog-title">
          {project ? "Edit Project" : "Create Project"}
          <p className="app-dialog__subtitle">
            {project
              ? "Update the project details."
              : "Set up a project for your team."}
          </p>
        </DialogTitle>
        <DialogContent>
          <div className="app-dialog__form">
            <TextField
              label="Project Title"
              fullWidth
              className="app-dialog__field"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />

            <TextField
              label="Description"
              fullWidth
              className="app-dialog__field"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
          </div>
        </DialogContent>
        <DialogActions className="app-dialog__actions">
          <Button
            variant="outlined"
            className="app-button-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="app-button-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : project
                ? "Update project"
                : "Create project"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
