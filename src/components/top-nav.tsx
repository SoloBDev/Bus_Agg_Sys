"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import { useSettings } from "@/context/settings-context";
import { Notifications } from "./notifications";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function TopNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const { settings } = useSettings();

  const { user, logout } = useAuth();

  return (
    <header className='sticky top-0 z-40 border-b bg-background w-[105%]'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='hidden md:block'>
          <nav className='flex items-center space-x-2'>
            <Link to='/' className='text-sm font-medium'>
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <span className='text-muted-foreground'>/</span>
                <Link
                  to={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className='text-sm font-medium'
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={settings.avatar} alt={settings.fullName} />
                  <AvatarFallback>
                    {settings.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {settings.fullName}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {settings.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to='/settings' className="ml-3">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings' className="ml-3">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={logout}
                  className='h-8  flex gap-3 bg-transparent'
                >
                  <LogOut className='h-4 w-4' />
                  <span>&nbsp; Log Out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
