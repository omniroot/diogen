import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$custom_id/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$custom_id/timeline"!</div>
}
