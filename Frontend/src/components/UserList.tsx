import useUsers from "../hook/use-user"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Button, IconButton } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import UserModal from "./Modals/UserModal"
import { useState } from "react"
import type { User, RegisterUser, UpdateUser } from "../Types/user"
import { Popover } from '@mui/material';
import { useNavigate } from "@tanstack/react-router";


type UserFormValues = Omit<User, "id"> & { id?: string }

export default function UserList() {

  const { GetAllUsers, RegisterUser, UpdateUser, DeleteUser } = useUsers()
  const { data: users = [] } = GetAllUsers
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleCreate = () => {
    setSelectedUser(null)
    setOpen(true)
  }

  const handleEdit = (user : User) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleSubmit = (data: UserFormValues) => {
    if (data.id) {
      UpdateUser.mutate(data as UpdateUser)
    } else {
      RegisterUser.mutate(data as RegisterUser)
    }
  }
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event :  React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopup = Boolean(anchorEl);

  const navigate = useNavigate();
  const handleRowClick = (params: { row: { id: string } }) => {
    navigate({
      to: "/users/$userId",
      params: {
        userId: params.row.id,
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
      resizable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
      resizable: false,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.6,
      sortable: false,
      resizable: false,
    },
    {
      field: "action",
      headerName: "",
      flex: 0.3,
      sortable: false,
      resizable: false,
      renderCell: ({ row }) => (
        <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Popover
        open={openPopup}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="flex flex-col bg-gray-900 p-2 rounded text-white text-sm gap-4 border border-gray-500">
          <button onClick={() => {handleEdit(row); handleClose(); }} className="text-white hover:bg-blue-200 hover:text-gray-700">Edit</button>
          <button onClick={() => {DeleteUser.mutate(row.id); handleClose(); }} className="text-white hover:bg-blue-200 hover:text-gray-700">Delete</button>
        </div>
      </Popover>
    </>

      ),
    },
  ]
  
  return (
    <div className="w-full p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">{users.length} Users</h1>

        <Button variant="contained" onClick={handleCreate} 
            className="border border-black text-sm text-black">
          Create User
        </Button>
      </div>
      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />

      <div className="bg-white rounded-xl shadow border border-gray-200">

        <div className="max-h-[70vh]">
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
            hideFooter
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            sx={{
                "& .MuiDataGrid-cell": {
                outline: "none",
                userSelect: "none"
                },
                "& .MuiDataGrid-cell:focus": {
                outline: "none"
                },
                "& .MuiDataGrid-cell:focus-within": {
                outline: "none"
                }
            }}
          />
        </div>

      </div>

    </div>
  )
}