import { createFileRoute } from '@tanstack/react-router'
import RouteComponent from '../components/pages/users'
import requireAuth from '../utils/auth-guard'

export const Route = createFileRoute('/users')({
  beforeLoad: requireAuth,
  component: RouteComponent,
})

