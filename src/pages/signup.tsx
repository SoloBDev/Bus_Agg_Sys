"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import * as yup from "yup";
import { cn } from "../lib/utils";



// Dummy company data for frontend validation
const REGISTERED_COMPANIES = [
  "Addis Bus System",
  "Selam Bus",
  "Sky Bus Ethiopia",
];

// Yup validation schema
const signupSchema = yup.object().shape({
  companyName: yup
    .string()
    .required("Company Name is required")
    .test("company-check", "Company not registered in our system", (value) => {
      if (!value) return false;
      return REGISTERED_COMPANIES.some(
        (company) => company.toLowerCase() === value.toLowerCase()
      );
    }),
  adminName: yup.string().required("Admin Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  branch: yup.string(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["admin", "operator"], "Role must be either 'admin' or 'operator'")
    .required("Role is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type FormData = yup.InferType<typeof signupSchema>;


export default function SignupPage() {
  const navigate = useNavigate();
  type UserRole = "admin" | "operator";
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    adminName: "",
    role: "" as UserRole,
    email: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [validatingCompany, setValidatingCompany] = useState(false);

  // Debounced company validation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.companyName.trim().length > 2) {
        setValidatingCompany(true);
        try {
          await signupSchema.validateAt("companyName", formData);
          setErrors((prev) => ({ ...prev, companyName: undefined }));
        } catch (err) {
          if (err instanceof yup.ValidationError) {
            setErrors((prev) => ({ ...prev, companyName: err.message }));
          }
        } finally {
          setValidatingCompany(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.companyName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      await signupSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Show success toast and redirect
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Partial<FormData> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof FormData] = error.path === "role" ? undefined : error.message;
            if (Object.keys(validationErrors).length === 1) {
              toast.error(error.message, {
                position: "bottom-right",
              });
            }
          }
        });
        setErrors(validationErrors);
      } else {
        toast.error(
          (err as Error).message || "There was an error creating your account",
          { position: "bottom-right" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasError = (field: keyof FormData) => !!errors[field];

  return (
    <div className='flex'>
      <div className='flex flex-1 flex-col justify-between px-10 py-4'>
        <div className='mb-6 flex justify-center'>
          <Logo />
        </div>
        <div className='flex flex-col mx-auto w-full max-w-md justify-center'>
          <div className='mb-4'>
            <h1 className='!text-4xl font-bold'>Let&apos;s get started</h1>
            <p className='mt-1 text-muted-foreground text-sm'>
              Create your account to get started with our services.
            </p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-3'>
            {/* Company Name Field */}
            <div className='relative space-y-2'>
              <Label
                htmlFor='companyName'
                className={`
                  absolute -top-3 left-2 px-1 bg-background text-xs
                  transition-all duration-200
                  ${
                    formData.companyName
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }
                  peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-3 peer-focus:left-2 peer-focus:text-xs text-gray-500
                `}
              >
                Company Name
              </Label>
              <Input
                id='companyName'
                name='companyName'
                placeholder='Company Name'
                value={formData.companyName}
                onChange={handleChange}
                className={cn(
                  "h-10 pt-3 peer focus:border-0",
                  hasError("companyName") &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {validatingCompany && (
                <p className='text-xs text-gray-500'>Checking company...</p>
              )}
            </div>

            {/* Admin Name Field */}
            <div className='relative space-y-2'>
              <Label
                htmlFor='adminName'
                className={`
                  absolute -top-2 left-2 px-1 bg-background text-xs
                  transition-all duration-200
                  ${
                    formData.adminName
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }
                  peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500
                `}
              >
                Agent/Admin Name
              </Label>
              <Input
                id='adminName'
                name='adminName'
                placeholder={"Agent/Admin Name"}
                value={formData.adminName}
                onChange={handleChange}
                className={cn(
                  "h-10 pt-3 peer",
                  hasError("adminName") &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>

            {/* Email Field */}
            <div className='relative space-y-2'>
              <Label
                htmlFor='email'
                className={`
                  absolute -top-2 left-2 px-1 bg-background text-xs
                  transition-all duration-200
                  ${
                    formData.email
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }
                  peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500
                `}
              >
                <span className='font-poppins'>Your Email</span>
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder={"your email"}
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "h-10 pt-3 peer",
                  hasError("email") &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>

            {/* Branch Field */}
            <div className='relative mt-2 flex items-center space-x-4'>
              <Label
                htmlFor='branch'
                className={`
      absolute -top-2 left-2 px-1 bg-background text-xs
      transition-all duration-200
      ${formData.branch ? "opacity-100 scale-100" : "opacity-0 scale-90"}
      peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500
    `}
              >
                Branch (optional for others)
              </Label>
              <Input
                id='branch'
                name='branch'
                placeholder={"your district(required for operators)"}
                value={formData.branch}
                onChange={handleChange}
                className='h-10 pt-3 peer'
              />

              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className='h-10 border rounded-md px-2 text-gray-700'
              >
                <option value='' disabled>
                  Select your role
                </option>
                <option value='admin'>Admin</option>
                <option value='operator'>Operator</option>
              </select>
            </div>

            {/* Password Field */}
            <div className='relative mt-2'>
              <Label
                htmlFor='password'
                className={`
                  absolute -top-2 left-2 px-1 bg-background text-xs
                  transition-all duration-200
                  ${
                    formData.password
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }
                  peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500 z-4
                `}
              >
                Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  placeholder={"••••••••"}
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "h-10 pt-3 pr-10 peer",
                    hasError("password") &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='flex items-center absolute right-3 top-1/2 -translate-y-1/2 h-8'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-muted-foreground' />
                  ) : (
                    <Eye className='h-5 w-5 text-muted-foreground' />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className='relative mt-2'>
              <Label
                htmlFor='confirmPassword'
                className={`
                  absolute -top-2 left-2 px-1 bg-background text-xs
                  transition-all duration-200
                  ${
                    formData.confirmPassword
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }
                  peer-focus:opacity-100 peer-focus:scale-100 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs text-gray-500
                `}
              >
                Confirm Password
              </Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder={"••••••••"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn(
                  "h-10 pt-3 peer",
                  hasError("confirmPassword") &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 mt-4'
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "SIGN UP"}
            </Button>

            {/* Login Redirection Link */}
            <div className='text-center'>
              <p className='text-sm text-muted-foreground'>
                Already have an account?{" "}
                <Link
                  to='/login'
                  className='text-primary hover:underline font-medium'
                >
                  Log in here
                </Link>
              </p>
            </div>
          </form>
        </div>
        <footer className='mt-6'>
          <div className='flex space-x-4 justify-center'>
            <Link
              to='/privacy'
              className='text-sm text-muted-foreground hover:underline'
            >
              Privacy & Terms
            </Link>
            <Link
              to='/language'
              className='text-sm text-muted-foreground hover:underline'
            >
              Language
            </Link>
            <Link
              to='/contact'
              className='text-sm text-muted-foreground hover:underline'
            >
              Contact Us
            </Link>
          </div>
        </footer>
      </div>

      <div
        className='hidden bg-primary-foreground/90 md:block md:w-2/5'
        style={{
          clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className='flex h-full items-center justify-center p-10'>
          <div className='text-center text-gray-800'>
            <blockquote className='text-3xl font-bold'>
              &quot;Trust ADDIS BUS for reliable and efficient Travels across
              Ethiopia.&quot;
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
