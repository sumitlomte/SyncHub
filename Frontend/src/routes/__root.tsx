import { createRootRoute, Outlet } from "@tanstack/react-router"
import SideNav from "../components/SideNav"

export const Route = createRootRoute({
  component: RootLayout,
})

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