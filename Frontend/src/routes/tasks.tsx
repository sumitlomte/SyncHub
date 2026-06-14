import { createFileRoute } from '@tanstack/react-router'
import Task from '../components/pages/tasks/index'
import requireAuth from '../utils/auth-guard'

export const Route = createFileRoute('/tasks')({
  beforeLoad: requireAuth,
  component: Task,
})

