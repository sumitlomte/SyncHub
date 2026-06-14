import { createFileRoute } from '@tanstack/react-router'
import Projects from '../components/pages/projects/index'
import requireAuth from '../utils/auth-guard'

export const Route = createFileRoute('/projects')({
  beforeLoad: requireAuth,
  component: Projects,
})
