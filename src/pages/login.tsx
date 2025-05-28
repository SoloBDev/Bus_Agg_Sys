"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../components/logo";
import { useAuth } from "../context/auth-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login } = useAuth();

  const validateForm = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);

        // Show first error in toast
        if (error.inner.length > 0 && error.inner[0].message) {
          toast.error(error.inner[0].message);
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const isValid = await validateForm();
    if (!isValid) return;
  
    setIsLoading(true);
  
    try {
      await login(email, password); // Pass both email and password
      toast.success("Login successful", {
        description: "Welcome back to the Addis Bus System",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center mx-auto p-4 pt-8 w-7xl '>
      <div className='flex w-full max-w-md flex-col items-center space-y-8 px-4'>
        <div className='flex flex-col items-center space-y-8 px-4 w-full'>
          <Logo />

          <div className='text-center space-y-2 w-full'>
            <h1 className='text-4xl font-bold'>Welcome back to Dashboard</h1>
            <p className='text-zinc-400 w-full'>
              Sign in-up to enjoy the best managing experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='w-full space-y-4'>
            <div>
              <Label
                htmlFor='email'
                className={`
                              
                                peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500
                              `}
              />

              <Input
                id='email'
                placeholder='enter your email address'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 peer rounded-md text-white focus:border-0 ${
                  errors.email ? "border border-red-500" : ""
                }`}
              />
            </div>
            

            <div>
              <div className='relative'>
                <Input
                  id='password'
                  placeholder='••••••••'
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md text-white pr-10 ${
                    errors.password ? "border border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 h-8 flex items-center'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>
            <button
              type='submit'
              className='w-full py-3 bg-[#d3e04d] hover:bg-[#c1cd45] /90 font-medium text-primary-foreground/80 rounded-md transition-colors'
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <div className='flex justify-between w-full text-sm'>
            <p className='text-zinc-400'>
              Don't You Registered yet?{" "}
              <Link to='/register' className='text-[#ff6b6b] hover:underline'>
                Register
              </Link>
            </p>
            <Link
              to='/forgot-password'
              className='text-[#ff6b6b] hover:underline'
            >
              Welcome Back?
            </Link>
          </div>
        </div>
      </div>

      <footer className='w-full text-center mt-auto'>
        <div className='flex justify-center gap-6 mb-4 text-'>
          <Link to='/privacy' className='!text-[#ff6b6b] text-sm'>
            Privacy & Terms
          </Link>
          <Link to='/language' className='!text-[#ff6b6b] text-sm'>
            Language
          </Link>
          <Link to='/contact' className='!text-[#ff6b6b] text-sm'>
            Contact Us
          </Link>
        </div>
        <p className='text-zinc-400 text-sm'>Powered By S4Y Development</p>
      </footer>
    </div>
  );
}
