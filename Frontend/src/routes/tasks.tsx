import { createFileRoute } from '@tanstack/react-router'
import Task from '../components/pages/tasks/index'

export const Route = createFileRoute('/tasks')({
  component: Task,
})

