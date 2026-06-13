import { createRootRoute, Outlet } from "@tanstack/react-router"
import SideNav from "../components/SideNav"

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>404 – Page Not Found</h1>
      <p style={{ color: "#64748b" }}>
        The page you're looking for doesn't exist.
      </p>
    </div>
  )
}

function RootLayout() {
  return (
    <div style={{ display: "flex" }}>
      <style>
        {`
          /* Global Scrollbar styling - Hidden by default, visible on hover */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 9999px;
          }
          *:hover::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* tailwind slate-300 */
          }
        `}
      </style>
      <SideNav />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}