import { createFileRoute } from '@tanstack/react-router'
import RouteComponent from '../components/pages/users'
export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

