import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/issues/$issue_id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/issues/$issue_id"!</div>
}
