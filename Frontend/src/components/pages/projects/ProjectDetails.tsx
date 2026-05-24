import { useState } from "react"
import { useParams, useNavigate } from "@tanstack/react-router"
import { Button, CircularProgress, Tooltip, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, ListItemIcon } from "@mui/material"
import { ArrowLeft, Users, Plus, Trash2 } from "lucide-react"
import useProjects from "../../../hook/use-project"
import ProjectConversation from "../../ProjectConversation"
import useTeam from "../../../hook/use-team"
import useUsers from "../../../hook/use-user"
import type { User } from "../../../Types/user"

export default function ProjectDetails() {
  const { projectId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { RemoveTeamMembers, AddTeamMembers } = useTeam()

  

  const [teamAnchorEl, setTeamAnchorEl] = useState<HTMLElement | null>(null)
  
  // Add Member State
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([])

  const handleToggleNewMember = (userId: string) => {
    setSelectedNewMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleCloseAddMember = () => {
    setAddMemberDialogOpen(false)
    setSelectedNewMembers([])
  }

  const handleAddMembersSubmit = () => {
    if (selectedNewMembers.length > 0) {
      // Note: Assuming AddTeamMembers uses 'productId' mirroring RemoveTeamMembers
      if (AddTeamMembers) {
        AddTeamMembers.mutate({ productId: projectId as string, userIds: selectedNewMembers })
      }
      handleCloseAddMember()
    }
  }

  const handleTeamClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTeamAnchorEl(event.currentTarget)
  }

  const handleTeamClose = () => {
    setTeamAnchorEl(null)
  }

  const handleRemoveMember = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      RemoveTeamMembers.mutate({ productId: projectId as string, userIds: [userId] })
    }
  }

  const openTeamPopup = Boolean(teamAnchorEl)

  const { GetProject } = useProjects(false, false, projectId as string)

  // Fetch project data
  const { data: project, isLoading, error } = GetProject

  // Fetch all users
  const { GetAllUsers } = useUsers()
  const { data: allUsers = [], isLoading: isLoadingUsers } = GetAllUsers

  if (!projectId) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-400">Select a project to view details</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <CircularProgress />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project not found</h2>
        <Button
          variant="contained"
          onClick={() => navigate({ to: "/projects" })}
        >
          Back to Projects
        </Button>
      </div>
    )
  }

  type ApiProjectData = {
    teamMembers?: unknown[];
    teamMember?: unknown[];
    members?: unknown[];
    users?: unknown[];
    data?: { teamMembers?: unknown[] };
  };

  const p = project as ApiProjectData;
  const teamMembers = p.teamMembers || p.teamMember || p.members || p.users || p.data?.teamMembers || [];
  const projectMemberIds = teamMembers.map((m: unknown) => {
    if (typeof m === "string") return m;
    const member = m as Record<string, unknown>;
    return member?.id || member?._id || member?.userId;
  }).filter(Boolean) as string[];

  const availableUsers = allUsers.filter((u: User) => !projectMemberIds.includes(u.id as string))

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip title="Back to Projects">
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate({ to: "/projects" })}
              >
                <ArrowLeft size={20} />
              </Button>
            </Tooltip>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-500">Project ID: {project.id}</p>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleTeamClick}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <Users size={16} />
                  {projectMemberIds.length} Members
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popover for Team Members */}
      <Popover
        open={openTeamPopup}
        anchorEl={teamAnchorEl}
        onClose={handleTeamClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div className="w-80 p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="font-semibold text-gray-800">Team Members</h3>
            <Tooltip title="Add Member">
              <IconButton size="small" color="primary" onClick={() => setAddMemberDialogOpen(true)}>
                <Plus size={20} />
              </IconButton>
            </Tooltip>
          </div>
          <List className="max-h-60 overflow-y-auto">
            {projectMemberIds.length > 0 ? (
              projectMemberIds.map((memberId: string) => {
                const memberUser = allUsers.find((u: User) => u.id === memberId)
                const displayName = memberUser?.name || `User ${memberId.substring(0, 6)}`

                return (
                  <ListItem
                    key={memberId}
                    secondaryAction={
                      <Tooltip title="Remove Member">
                        <IconButton edge="end" size="small" color="error" onClick={() => handleRemoveMember(memberId)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="w-8 h-8 text-sm font-semibold">{displayName.substring(0, 2).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={displayName} secondary="Member" />
                  </ListItem>
                )
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No members assigned.</p>
            )}
          </List>
        </div>
      </Popover>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialogOpen} onClose={handleCloseAddMember} maxWidth="xs" fullWidth>
        <DialogTitle className="border-b border-gray-100">Add Team Members</DialogTitle>
        <DialogContent className="p-0">
          <List className="pt-0">
            {isLoadingUsers ? (
              <div className="flex justify-center py-6"><CircularProgress size={24} /></div>
            ) : availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <ListItem
                  key={user.id}
                  onClick={() => handleToggleNewMember(user.id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedNewMembers.includes(user.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemAvatar>
                    <Avatar className="w-8 h-8 text-sm font-semibold bg-blue-100 text-blue-600">
                      {user.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={`ID: ${user.id}`} />
                </ListItem>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">No more users available to add.</p>
            )}
          </List>
        </DialogContent>
        <DialogActions className="border-t border-gray-100 p-4">
          <Button onClick={handleCloseAddMember} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddMembersSubmit} variant="contained" color="primary" disabled={selectedNewMembers.length === 0}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex">
          {/* Team Conversation */}
          <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
            <ProjectConversation />
          </div>
        </div>
      </div>
    </div>
  )
}
