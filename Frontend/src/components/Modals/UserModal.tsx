import { Modal, Box, TextField, Button, MenuItem, FormHelperText } from "@mui/material"
import { useEffect } from "react"
import { useFormValidation, userFormValidator } from "../../hook/use-form-validation"

type User = {
  id?: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  password?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: User) => void
  user?: User | null
}

export default function UserModal({ open, onClose, onSubmit, user }: Props) {

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useFormValidation({
    initialValues: {
      name: "",
      email: "",
      role: "USER",
      password: "",
    },
    validate: userFormValidator,
    onSubmit: (data) => {
      onSubmit(data as User)
      onClose()
    },
  })

  useEffect(() => {
    if (user) {
      setValues({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      })
    } else {
      setValues({
        name: "",
        email: "",
        role: "USER",
        password: "",
      })
    }
  }, [user, setValues])

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          {user ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!(touched.name && errors.name)}
            />
            {touched.name && errors.name && (
              <FormHelperText error>{errors.name}</FormHelperText>
            )}
          </div>

          <div>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!(touched.email && errors.email)}
            />
            {touched.email && errors.email && (
              <FormHelperText error>{errors.email}</FormHelperText>
            )}
          </div>

          <div>
            <TextField
              select
              label="Role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </TextField>
          </div>

          <div>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!(touched.password && errors.password)}
              helperText={touched.password && errors.password ? errors.password : "Leave empty to keep current password"}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : user ? "Update" : "Create"}
            </Button>
          </div>

        </form>

      </Box>
    </Modal>
  )
}