import useUsers from "../hook/use-user";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Button, IconButton, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UserModal, { type UserFormData } from "./Modals/UserModal";
import { useState } from "react";
import type { User } from "../types/user";
import { Popover } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { ListSkeleton } from "./ui/Skeleton";

export default function UserList() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { GetAllUsers, RegisterUser, UpdateUser, DeleteUser } = useUsers({
    fetchAllUsers: true,
  });
  const { data: users = [], isLoading } = GetAllUsers;
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEdit = (
    user: User,
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.currentTarget.blur();
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSubmit = (data: UserFormData) => {
    if (data.id) {
      UpdateUser.mutate({ ...data, id: data.id });
    } else {
      RegisterUser.mutate({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      });
    }
  };
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRowUser, setSelectedRowUser] = useState<User | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowUser(null);
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

  const columns: GridColDef<User>[] = [
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
      hideable: true,
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
      renderCell: ({ row }: GridRenderCellParams<User>) => (
        <>
          <IconButton
            size="small"
            aria-label={`Actions for ${row.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRowUser(row);
              setAnchorEl(e.currentTarget as HTMLElement);
            }}
          >
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
            <div className="app-popover__actions">
              <button
                onClick={(event) => {
                  if (selectedRowUser) {
                    handleEdit(selectedRowUser, event);
                  }
                  handleClose();
                }}
                type="button"
                className="app-popover__action"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  DeleteUser.mutate(row.id);
                  handleClose();
                }}
                type="button"
                className="app-popover__action"
              >
                Delete
              </button>
            </div>
          </Popover>
        </>
      ),
    },
  ].filter((column) => !isMobile || column.field !== "email");

  return (
    <div className="w-full min-w-0 p-3 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold sm:text-xl">
          {users.length} Users
        </h1>

        <Button
          variant="contained"
          onClick={handleCreate}
          className="app-button-primary"
        >
          Create User
        </Button>
      </div>
      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />

      <div className="app-surface overflow-hidden rounded-xl">
        <div className="max-h-[calc(100dvh-12rem)] overflow-x-auto md:max-h-[70vh]">
          {isLoading ? (
            <div className="p-4">
              <ListSkeleton rows={5} columns={4} />
            </div>
          ) : isMobile ? (
            <ul className="grid list-none gap-3 p-3 sm:p-4">
              {users.map((row) => (
                <li key={row.id} className="app-table-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold">
                        {row.name}
                      </p>
                      <p className="app-table-card__secondary mt-1 break-all text-sm">
                        {row.email}
                      </p>
                    </div>
                    <span className="app-status-pill app-status-pill--primary shrink-0">
                      {row.role}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="small"
                      variant="outlined"
                      className="app-button-secondary"
                      onClick={() =>
                        navigate({
                          to: "/users/$userId",
                          params: { userId: row.id },
                        })
                      }
                    >
                      View details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      className="app-button-secondary"
                      onClick={(event) => handleEdit(row, event)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      className="app-button-danger"
                      variant="outlined"
                      onClick={() => DeleteUser.mutate(row.id)}
                      disabled={DeleteUser.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <DataGrid
              className="app-data-grid"
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              onRowClick={handleRowClick}
              hideFooter
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              disableRowSelectionOnClick
              getRowClassName={({ indexRelativeToCurrentPage }) =>
                indexRelativeToCurrentPage % 2 === 0
                  ? "app-data-grid__row--even"
                  : "app-data-grid__row--odd"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
