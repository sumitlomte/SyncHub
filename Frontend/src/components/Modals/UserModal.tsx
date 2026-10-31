import {
  Button,
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
import { userFormSchema, type UserFormValues } from "../../schemas/user.schema";
import type { User } from "../../types/user";

export type UserFormData = UserFormValues;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
};

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  role: "USER",
  password: "",
};

export default function UserModal({ open, onClose, onSubmit, user }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    reset(
      user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
          }
        : emptyValues,
    );
  }, [open, reset, user]);

  const submitForm = (values: UserFormValues) => {
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
      aria-labelledby="user-dialog-title"
    >
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <DialogTitle id="user-dialog-title">
          {user ? "Edit User" : "Create User"}
          <p className="app-dialog__subtitle">
            {user
              ? "Update account details and access role."
              : "Add a user and set their access role."}
          </p>
        </DialogTitle>
        <DialogContent>
          <div className="app-dialog__form">
            <TextField
              label="Name"
              fullWidth
              className="app-dialog__field"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              className="app-dialog__field"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Role"
                  fullWidth
                  className="app-dialog__field"
                  {...field}
                >
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </TextField>
              )}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              className="app-dialog__field"
              error={!!errors.password}
              helperText={
                errors.password?.message ??
                "Leave empty to keep the current password when editing"
              }
              {...register("password")}
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
            {isSubmitting ? "Saving..." : user ? "Update user" : "Create user"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
