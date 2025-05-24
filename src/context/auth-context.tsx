"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define user roles
export type UserRole = "system_admin" | "tenant_admin" | "operator";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  companyName?: string;
  branch?: string;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
}

// Define signup data interface
export interface SignupData {
  companyName?: string;
  adminName: string;
  email: string;
  branch?: string;
  password: string;
  role: UserRole;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "System Admin",
    email: "admin@addisbus.com",
    companyName: "ADDIS Bus",
    role: "system_admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Abay Bus Admin",
    email: "tenant@abaybus.com",
    role: "tenant_admin",
    companyName: "Abay Bus",
    branch: "Addis Ababa",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Field Operator",
    email: "operator@addisbus.com",
    role: "operator",
    companyName: "Odda Bus",
    branch: "Akaki Kality",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user by email (mock authentication)
      const foundUser = mockUsers.find((u) => u.email === email);

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      // Redirect based on role
      if (foundUser.role === "system_admin") {
        navigate("/admin/dashboard");
      } else if (foundUser.role === "tenant_admin") {
        navigate("/tenant/dashboard");
      } else {
        navigate("/operator/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new user (in a real app, this would be handled by the backend)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.adminName,
        email: userData.email,
        role: userData.companyName ? "tenant_admin" : "operator",
        companyName: userData.companyName,
        branch: userData.branch,
        password: userData.password,
        avatar: "/placeholder.svg?height=40&width=40",
      };

      // Set user in state and localStorage
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Redirect based on role
      if (newUser.role === "tenant_admin") {
        navigate("/tenant/dashboard");
      } else {
        navigate("/operator/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
