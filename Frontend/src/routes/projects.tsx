import { createFileRoute } from '@tanstack/react-router'
import Projects from '../components/pages/projects/index'

export const Route = createFileRoute('/projects')({
  component: Projects,
})
