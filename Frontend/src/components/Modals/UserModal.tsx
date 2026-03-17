import { Modal, Box, TextField, Button, MenuItem } from "@mui/material"
import { startTransition, useEffect, useState } from "react"

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

  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    role: "USER",
    password: "",
  })

  useEffect(() => {
    startTransition(() => {
      if (user) {
        setForm(user)
      } else {
        setForm({ name: "", email: "", role: "USER" })
      }
    })
  }, [user])

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
          {user ? "Edit User" : "Create User"}
        </h2>

        <div className="flex flex-col gap-4">

          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </TextField>

        <TextField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />          

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSubmit}>
              {user ? "Update" : "Create"}
            </Button>
          </div>

        </div>

      </Box>
    </Modal>
  )
}