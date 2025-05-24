"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Set base URL for API calls
axios.defaults.baseURL = "http://localhost:3001";

// Define user roles
export type UserRole = "system_admin" | "operator" | "tenant_admin";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // password?: string
  companyName?: string;
  branch?: string;
  avatar?: string;
  status: "active" | "pending" | "suspended";
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; // Fix parameters
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

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      // Verify token is still valid (in a real app, you'd call an API endpoint)
      setAdmin(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Verify user credentials
      // const userResponse = await axios.get(
      //   `/users?email=${email}&password=${password}`
      // );

      // if (userResponse.data.length === 0) {
      //   throw new Error("Invalid credentials");
      // }

      // 2. Get auth token (simulated)
      const authResponse = await axios.post(
        `http://localhost:3001/api/operator/login`,
        {
          email,
          password,
        }
      );
      if (authResponse.data.status) {
        if (authResponse.data.status === "pending") {
          navigate("/pending-approval");
          throw new Error("Your account is pending admin approval");
        }

        if (authResponse.data.status === "suspended") {
          throw new Error(
            "Account suspended. Please contact support@example.com"
          );
        }
      }
      if (authResponse.data.success === false) {
        throw new Error("Authentication failed");
      }

      // 3. Store user and token
      // const user = userResponse.data[0];
      /*
       success: true,
      message: "Login successful",
      token,
       */
      const token = authResponse.data.token;
      const success = authResponse.data.success;
      const user = authResponse.data.user;

      setAdmin(user);
      // localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("success", success);

      // 4. Redirect based on role
      const redirectPath = {
        system_admin: "/admin/dashboard",
        tenant_admin: "/tenant/dashboard",
        operator: "/operator/dashboard",
      }[user.role as UserRole];

      navigate(redirectPath);
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function (updated to use API)
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      // Make API call to json-server
      const response = await axios.post("/users", {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.adminName,
        email: userData.email,
        role: userData.companyName ? "tenant_admin" : "operator",
        companyName: userData.companyName,
        branch: userData.branch,
        password: userData.password,
        avatar: "/placeholder.svg?height=40&width=40",
      });

      // Simulate login after signup
      const loginResponse = await axios.post("/auth/login", {
        email: userData.email,
        password: userData.password,
      });

      // Set user in state and localStorage
      setAdmin(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", loginResponse.data.token);

      // Redirect based on role
      if (response.data.role === "tenant_admin") {
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

  // Logout function (updated to clear token)
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user: admin, isLoading, login, signup, logout }}
    >
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
