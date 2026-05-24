import { createFileRoute } from '@tanstack/react-router'
import ProjectDetails from '../components/pages/projects/ProjectDetails'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetails,
})
