"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import {
  BarChart3,
  Bus,
  CreditCard,
  LayoutDashboard,
  QrCode,
  Settings,
  Users,
  LogOut,
  Bell,
  ChevronLeft,
  Book,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";
import { FaBusSimple, FaRoute } from "react-icons/fa6";

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === "system_admin") {
      return [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Tenants", href: "/admin/tenants", icon: Bus },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Platform Config", href: "/admin/config", icon: Settings },
        { name: "Security", href: "/admin/security", icon: QrCode },
        { name: "Finances", href: "/admin/finances", icon: CreditCard },
      ];
    } else if (user.role === "tenant_admin") {
      return [
        { name: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
        { name: "Buses", href: "/tenant/buses", icon: Bus },
        { name: "Routes", href: "/tenant/routes", icon: FaRoute },
        { name: "Finances", href: "/tenant/finances", icon: CreditCard },
        { name: "Scan Tickets", href: "/tenant/scan", icon: QrCode },
        { name: "Operators", href: "/tenant/operators", icon: Users },
        { name: "Feedbacks", href: "/tenant/feedbacks", icon: Bell },
        { name: "Settings", href: "/tenant/settings", icon: Settings },
      ];
    } else {
      return [
        {
          name: "Dashboard",
          href: "/operator/dashboard",
          icon: LayoutDashboard,
        },
        { name: "Trips", href: "/operator/trips", icon: Bus },
        { name: "Passengers", href: "/operator/passengers", icon: Users },
        { name: "Scan Tickets", href: "/operator/scan", icon: QrCode },
        { name: "Report Issue", href: "/operator/issues", icon: Bell },
      ];
    }
  };

  const navItems = getNavItems();

  // Toggle sidebar on mobile
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle sidebar collapse on desktop
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm'
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className='flex h-16 items-center justify-between border-b px-4'>
          <div className='flex items-center gap-2'>
            {!collapsed && (
              <div className='flex h-8 w-32 items-center !justify-between rounded-md  text-white '>
                <FaBusSimple className='!h-8 !w-8' />
                <span className='text-xl font-bold'>{user?.companyName || "Company Name"}</span>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              className={cn(
                "!bg-transparent hover:!border-0 !outline-none focus:!outline-none active:!outline-none ml-auto h-8 w-8",
                collapsed && "-ml-4"
              )}
              onClick={toggleCollapse}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
              <span className='sr-only'>
                {collapsed ? "expand" : "collapse"} Sidebar
              </span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto p-2'>
            {navItems.map((item) => (
                <Link
                to={item.href}
                key={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-secondary text-gray-900"
                    : "!text-gray-300 hover:bg-secondary hover:text-secondary-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
        </nav>

        {/* User section */}
        <div className='border-t p-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.name}
              />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <span className='truncate text-sm font-medium'>
                  {user?.name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user?.role.replace("_", " ")}
                </span>
              </div>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={logout}
              className='h-8 w-8'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant='ghost'
          size='sm'
          className={cn("ml-auto h-8 w-8", collapsed && "ml-0")}
          onClick={toggleCollapse}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          <span className='sr-only'>
            {collapsed ? "expand" : "collapse"} Sidebar
          </span>
        </Button>
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
