import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params }) => {
    return fetchPost(params.userId)
  },
})

