import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
  BriefcaseBusiness,
  CheckSquare,
  LogOut,
  Moon,
  Sun,
  UserRound,
  UsersRound,
  Workflow,
} from "lucide-react";
import { userStore } from "../store/Auth-store";
import { useTheme } from "../hooks/useTheme";
import useUsers from "../hook/use-user";
import { router } from "../router";

const navItems = [
  { to: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/users", label: "Users", icon: UsersRound },
] as const;

function ThemeButton({ expanded = false }: { expanded?: boolean }) {
  const { mode, toggleMode } = useTheme();
  const Icon = mode === "dark" ? Sun : Moon;
  const label =
    mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className={`app-nav-control inline-flex min-h-11 items-center justify-center gap-3 rounded-xl text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
        expanded ? "w-full px-3" : "w-11"
      }`}
    >
      <Icon size={19} aria-hidden="true" />
      {expanded && (
        <span>{mode === "dark" ? "Light theme" : "Dark theme"}</span>
      )}
    </button>
  );
}

export default function SideNav() {
  const { LogoutUser } = useUsers();
  const location = useLocation();
  const user = useStore(userStore, (state) => state.user);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await LogoutUser.mutateAsync();
    } catch {
      // The mutation reports logout failures; continue to the login screen.
    } finally {
      await router.navigate({ to: "/login" });
    }
  };

  const userName = user?.name || "Account";
  const role = user?.role || "USER";
  const initials = userName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="mobile-app-bar fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b px-3 shadow-sm backdrop-blur md:hidden">
        <Link
          to="/projects"
          className="app-brand-link flex min-w-0 items-center gap-2 font-semibold"
          aria-label="SyncHub home"
        >
          <span className="app-brand-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Workflow size={19} strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span className="app-brand-name tracking-tight">SyncHub</span>
        </Link>

        <div className="flex items-center gap-1">
          <div
            className="app-mobile-account flex max-w-[42vw] items-center gap-2 rounded-full py-1 pl-1 pr-2"
            title={`${userName} — ${role}`}
          >
            <span className="app-account-avatar flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
              {initials || <UserRound size={15} />}
            </span>
            <span className="truncate text-xs font-semibold">{role}</span>
          </div>
          <ThemeButton />
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="app-nav-control inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <nav
        aria-label="Main navigation"
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t px-2 pt-1 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`app-mobile-nav-link flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium ${
                active ? "is-active" : ""
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <aside
        className={`app-sidebar sticky top-0 hidden h-dvh shrink-0 flex-col border-r transition-[width] duration-200 md:flex ${
          isExpanded ? "w-52" : "w-16"
        }`}
      >
        <div className="app-sidebar__top flex h-16 items-center justify-between border-b px-2">
          {isExpanded ? (
            <Link
              to="/projects"
              className="app-brand-link flex min-w-0 items-center gap-3 font-semibold"
            >
              <span className="app-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Workflow size={22} strokeWidth={2.25} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="app-brand-name block truncate text-sm tracking-tight">
                  SyncHub
                </span>
                <span className="app-brand-caption block text-[11px] font-medium">
                  Project workspace
                </span>
              </span>
            </Link>
          ) : (
            <Link
              to="/projects"
              aria-label="SyncHub home"
              className="app-brand-mark mx-auto flex h-9 w-9 items-center justify-center rounded-xl"
            >
              <Workflow size={20} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          )}
          {isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse navigation"
              aria-expanded={isExpanded}
              className="app-nav-control rounded-lg p-2"
            >
              <span aria-hidden="true">‹</span>
            </button>
          )}
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1.5 p-1.5 pt-4"
        >
          {isExpanded && (
            <p className="app-sidebar__section-label px-3 pb-2">Workspace</p>
          )}
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                title={!isExpanded ? label : undefined}
                className={`app-sidebar-link flex min-h-10 items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium ${
                  !isExpanded ? "justify-center px-0" : ""
                }`}
              >
                <Icon size={19} aria-hidden="true" />
                {isExpanded && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__bottom space-y-1.5 border-t p-1.5">
          {isExpanded ? (
            <div className="app-account-chip flex items-center gap-3 rounded-xl p-3">
              <span className="app-account-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {initials || <UserRound size={18} />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {userName}
                </span>
                <span className="app-account-role block text-xs uppercase tracking-wide">
                  {role}
                </span>
              </span>
            </div>
          ) : (
            <button
              type="button"
              title={`${userName} — ${role}`}
              aria-label={`Signed in as ${userName}, ${role}`}
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(true)}
              className="app-nav-control mx-auto flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1"
            >
              <span className="app-account-avatar flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {initials || <UserRound size={18} />}
              </span>
              <span className="app-account-role text-[9px] font-semibold uppercase tracking-wide">
                {role}
              </span>
            </button>
          )}
          <ThemeButton expanded={isExpanded} />
          {!isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Expand navigation"
              title="Expand navigation"
              className="app-nav-control flex min-h-10 w-full items-center justify-center rounded-xl text-slate-400"
            >
              <span aria-hidden="true">›</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            title={!isExpanded ? "Log out" : undefined}
            className={`app-sidebar-logout flex min-h-10 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-medium transition-colors ${
              isExpanded ? "px-3" : ""
            }`}
          >
            <LogOut size={19} />
            {isExpanded && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
