import { createFileRoute } from '@tanstack/react-router'
import login from '../components/pages/login'
const LoginPage = login

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
