import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import SideNav from "../components/SideNav";
import { ThemeProvider } from "../providers/ThemeProvider";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="not-found-page">
      <h1>404 – Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </main>
  );
}

function RootLayout() {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/login/";

  return (
    <ThemeProvider>
      <div className="min-h-dvh md:flex">
        {!isLoginPage && <SideNav />}
        <main
          className={
            isLoginPage
              ? "min-h-dvh min-w-0 flex-1"
              : "h-dvh min-h-dvh min-w-0 flex-1 pt-14 pb-16 md:min-h-0 md:pt-0 md:pb-0"
          }
        >
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
