import { createRootRoute, Outlet } from "@tanstack/react-router"
import SideNav from "../components/SideNav"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div style={{ display: "flex" }}>
      <SideNav />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}