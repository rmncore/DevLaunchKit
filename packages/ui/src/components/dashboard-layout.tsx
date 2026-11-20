"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  Layers,
  Sparkles,
  Command,
  Star,
  Pin,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn.js";
import { ThemeToggle } from "../themes/theme-toggle.js";

// Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  shortcut?: string;
  items?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Context for Breadcrumbs
interface BreadcrumbContextType {
  breadcrumbs: { title: string; href?: string }[];
  setBreadcrumbs: (crumbs: { title: string; href?: string }[]) => void;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextType | undefined>(undefined);

export function useBreadcrumbs() {
  const context = React.useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
}

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = React.useState<{ title: string; href?: string }[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Context for Dashboard Sidebar States
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  favorites: string[];
  toggleFavorite: (href: string) => void;
  pinned: string[];
  togglePin: (href: string) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [pinned, setPinned] = React.useState<string[]>([]);

  const toggleFavorite = (href: string) => {
    setFavorites((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const togglePin = (href: string) => {
    setPinned((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]));
  };

  return (
    <BreadcrumbProvider>
      <SidebarContext.Provider
        value={{
          isOpen,
          setIsOpen,
          isCollapsed,
          setIsCollapsed,
          favorites,
          toggleFavorite,
          pinned,
          togglePin,
        }}
      >
        {children}
      </SidebarContext.Provider>
    </BreadcrumbProvider>
  );
}

// Side Navigation Component
export function DashboardSidebar({
  groups,
  activeHref,
  onNavigate,
  organizationName = "Personal Workspace",
  onOrgSwitch,
  homeHref,
  showItemActions = true,
}: {
  groups: NavGroup[];
  activeHref: string;
  onNavigate: (href: string) => void;
  organizationName?: string;
  onOrgSwitch?: () => void;
  homeHref?: string;
  showItemActions?: boolean;
}) {
  const {
    isCollapsed,
    setIsCollapsed,
    favorites,
    toggleFavorite,
    pinned,
    togglePin,
    isOpen,
    setIsOpen,
  } = useSidebar();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const menuButton = React.useRef<HTMLElement | null>(null);
  const closeButton = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    menuButton.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    return () => menuButton.current?.focus();
  }, [isOpen]);

  const workspaceLabel = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
        <Layers className="size-4" aria-hidden="true" />
      </span>
      <span className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
        {organizationName}
      </span>
      {onOrgSwitch && (
        <ChevronDown className="size-3 shrink-0 text-neutral-500" aria-hidden="true" />
      )}
    </>
  );

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-950/55 md:hidden"
        />
      )}
      <aside
        id="workspace-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:w-56 transition-transform duration-200 motion-reduce:transition-none",
          isCollapsed && "md:w-16 md:[&>div:first-child]:px-1 md:[&>div:first-child]:gap-1",
          isOpen ? "translate-x-0" : "invisible -translate-x-full md:visible md:translate-x-0"
        )}
        aria-label="Workspace navigation"
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) setIsOpen(false);
        }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 dark:border-slate-800">
          {onOrgSwitch ? (
            <button
              type="button"
              onClick={onOrgSwitch}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-lg px-1 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800",
                isCollapsed && "md:hidden"
              )}
            >
              {workspaceLabel}
            </button>
          ) : homeHref ? (
            <a
              href={homeHref}
              className={cn("flex min-w-0 items-center gap-2 px-1", isCollapsed && "md:hidden")}
            >
              {workspaceLabel}
            </a>
          ) : (
            <div className={cn("flex min-w-0 items-center gap-2 px-1", isCollapsed && "md:hidden")}>
              {workspaceLabel}
            </div>
          )}
          <button
            ref={closeButton}
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setIsOpen(false)}
            className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800"
          >
            <X className="size-5" />
          </button>
          {isCollapsed && (
            <div className="hidden size-7 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white md:flex dark:bg-slate-100 dark:text-slate-900">
              <Layers className="size-4" aria-hidden="true" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden shrink-0 md:flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Workspace pages">
          {groups.map((group) => (
            <div key={group.label} className="space-y-1">
              <h2
                className={cn(
                  "px-2 text-xs font-medium text-slate-500 dark:text-slate-400",
                  isCollapsed && "md:sr-only"
                )}
              >
                {group.label}
              </h2>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const childActive = item.items?.some((sub) => activeHref === sub.href) ?? false;
                  const expanded = expandedItems[item.title] ?? childActive;
                  const active = activeHref === item.href || childActive;
                  const isFavorite = favorites.includes(item.href);
                  const isPinned = pinned.includes(item.href);
                  const itemClass = cn(
                    "flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-indigo-500",
                    isCollapsed && "md:justify-center md:px-0"
                  );
                  const label = (
                    <>
                      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
                      <span className={cn("truncate", isCollapsed && "md:sr-only")}>
                        {item.title}
                      </span>
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "ml-auto size-3 shrink-0",
                            expanded && "rotate-180",
                            isCollapsed && "md:hidden"
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  );

                  return (
                    <li key={item.href}>
                      <div
                        className={cn(
                          "group flex items-center rounded-lg",
                          active
                            ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300"
                            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        )}
                      >
                        {item.items ? (
                          <button
                            type="button"
                            title={item.title}
                            aria-expanded={expanded && (!isCollapsed || isOpen)}
                            className={itemClass}
                            onClick={() => {
                              if (isCollapsed && !isOpen) {
                                setIsCollapsed(false);
                                setExpandedItems((prev) => ({ ...prev, [item.title]: true }));
                              } else {
                                setExpandedItems((prev) => ({ ...prev, [item.title]: !expanded }));
                              }
                            }}
                          >
                            {label}
                          </button>
                        ) : (
                          <a
                            className={itemClass}
                            href={item.href}
                            title={item.title}
                            aria-current={active ? "page" : undefined}
                            onClick={(event) => {
                              if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
                                return;
                              event.preventDefault();
                              onNavigate(item.href);
                              setIsOpen(false);
                            }}
                          >
                            {label}
                          </a>
                        )}
                        <div
                          className={cn(
                            "hidden shrink-0 items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                            showItemActions && !isCollapsed && "md:flex"
                          )}
                        >
                          <button
                            type="button"
                            aria-label={`Favorite ${item.title}`}
                            aria-pressed={isFavorite}
                            onClick={() => toggleFavorite(item.href)}
                            className={cn(
                              "rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700",
                              isFavorite && "text-amber-600"
                            )}
                          >
                            <Star className={cn("size-3", isFavorite && "fill-current")} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Pin ${item.title}`}
                            aria-pressed={isPinned}
                            onClick={() => togglePin(item.href)}
                            className={cn(
                              "rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700",
                              isPinned && "text-indigo-600 dark:text-indigo-300"
                            )}
                          >
                            <Pin className="size-3" />
                          </button>
                        </div>
                        {item.badge != null && (
                          <span className={cn("pr-2 text-xs", isCollapsed && "md:hidden")}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.items && expanded && (
                        <ul
                          className={cn(
                            "mt-1 space-y-0.5 border-l border-neutral-200 pl-2 dark:border-neutral-700",
                            isCollapsed && "md:hidden"
                          )}
                        >
                          {item.items.map((sub) => (
                            <li key={sub.href}>
                              <a
                                href={sub.href}
                                aria-current={activeHref === sub.href ? "page" : undefined}
                                onClick={(event) => {
                                  if (
                                    event.metaKey ||
                                    event.ctrlKey ||
                                    event.altKey ||
                                    event.shiftKey
                                  )
                                    return;
                                  event.preventDefault();
                                  onNavigate(sub.href);
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                  activeHref === sub.href
                                    ? "font-semibold text-indigo-700 dark:text-indigo-300"
                                    : "text-neutral-600 dark:text-neutral-400"
                                )}
                              >
                                {sub.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

// Topbar Header Component
export function Topbar({
  onSearchClick,
  onNotificationsClick,
  unreadNotifications = 0,
  userEmail = "user@devlaunchkit.com",
  onLogout,
  onNavigate,
}: {
  onSearchClick: () => void;
  onNotificationsClick: () => void;
  unreadNotifications?: number;
  userEmail?: string;
  onLogout?: () => void;
  onNavigate: (href: string) => void;
}) {
  const { isOpen, setIsOpen } = useSidebar();
  const { breadcrumbs } = useBreadcrumbs();
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      {/* Left items: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 md:hidden items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Open mobile menu"
          aria-controls="workspace-sidebar"
          aria-expanded={isOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav
          className="hidden sm:flex items-center text-sm font-medium text-neutral-500 space-x-1"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-neutral-300 dark:text-neutral-700">/</span>}
              {crumb.href ? (
                <button
                  onClick={() => onNavigate(crumb.href!)}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {crumb.title}
                </button>
              ) : (
                <span className="text-neutral-900 dark:text-white font-semibold">
                  {crumb.title}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right items: Search, Actions, Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className="flex h-9 w-9 sm:w-44 items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 px-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
          title="Search console (Ctrl+K)"
          aria-label="Search console"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-1 text-[10px] font-mono font-medium text-neutral-400 shadow-sm">
            <Command className="h-2 w-2" />K
          </kbd>
        </button>

        <button
          onClick={onNotificationsClick}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4 text-neutral-500" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 rounded-full hover:bg-neutral-100 p-0.5 transition-colors"
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <span className="grid size-8 place-items-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-neutral-800 dark:bg-neutral-900 z-50"
                >
                  <div className="px-3 py-2 text-xs border-b border-neutral-100 dark:border-neutral-800">
                    <p className="font-semibold text-neutral-950 dark:text-white">Active Account</p>
                    <p className="text-neutral-500 truncate mt-0.5">{userEmail}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate("/dashboard/profile");
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                    >
                      <User className="h-4 w-4 text-neutral-400" />
                      Your Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("/dashboard/settings");
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                    >
                      <Settings className="h-4 w-4 text-neutral-400" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("/dashboard/billing");
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                    >
                      <CreditCard className="h-4 w-4 text-neutral-400" />
                      Billing & Plans
                    </button>
                  </div>

                  {onLogout && (
                    <div className="border-t border-neutral-100 pt-1.5 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          onLogout();
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// Container wrappers
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">{children}</div>
  );
}

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:px-8 lg:py-7">
      {children}
    </main>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
