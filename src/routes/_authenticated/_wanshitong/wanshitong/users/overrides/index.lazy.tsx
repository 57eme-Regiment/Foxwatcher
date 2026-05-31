import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/_wanshitong/wanshitong/users/overrides/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_wanshitong/users/"!</div>
}
