"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RegistrationFormData {
  busBrandName: string;
  tinNumber: string;
  companyPhone: string;
  companyEmail: string;
  address: string;
  logo: string; // base64 string
  supportDocument: string; // base64 string
  operatorName: string;
  phone: string;
  email: string;
  password: string;
}

const schema = yup.object({
  busBrandName: yup.string().required("Bus brand name is required"),
  tinNumber: yup.string().required("TIN number is required"),
  companyPhone: yup.string().required("Phone is required"),
  companyEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  logo: yup.string().nullable().required("Logo is required"),
  supportDocument: yup
    .string()
    .nullable()
    .required("Supporting document is required"),
  operatorName: yup.string().required("Operator name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function RegistrationForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [docName, setDocName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      busBrandName: "",
      tinNumber: "",
      companyPhone: "",
      companyEmail: "",
      address: "",
      logo: "",
      supportDocument: "",
      operatorName: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "supportDocument"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setValue(field, base64);
      if (field === "logo") setLogoName(file.name);
      if (field === "supportDocument") setDocName(file.name);
    }
  };

  const getInputClass = (fieldName: keyof RegistrationFormData) => {
    return errors[fieldName]
      ? "h-8 text-xs border-red-500 focus:ring-red-500 focus:border-red-500"
      : "h-8 text-xs";
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const companyDetails = {
        busBrandName: data.busBrandName,
        tinNumber: data.tinNumber,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        address: data.address,
        logo: data.logo,
        supportDocument: data.supportDocument,
      };

      const operatorDetails = {
        operatorName: data.operatorName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      console.log("🚌 Company JSON:", companyDetails);
      console.log("👤 Operator JSON:", operatorDetails);

      toast.success(
        "OTP sent to contact email. Redirecting to verification..."
      );
      setTimeout(() => {
        navigate("/verify-email", {
          state: { email: data.email },
        });
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("File processing failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
      <h2 className='text-xs font-semibold mt-4 text-[#E2F163]/60 tracking-wider'>
        Company Detail
      </h2>

      <div className='space-y-2'>
        <Label className='font-normal text-gray-300'>Bus Brand Name</Label>
        <Input
          className={getInputClass("busBrandName")}
          {...register("busBrandName")}
          placeholder='Bus Brand Name'
        />
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>TIN Number</Label>
          <Input
            className={getInputClass("tinNumber")}
            {...register("tinNumber")}
            placeholder='TIN Number'
          />
        </div>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Company Phone</Label>
          <Input
            type='tel'
            className={getInputClass("companyPhone")}
            {...register("companyPhone")}
            placeholder='Phone number'
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Company Email</Label>
          <Input
            type='email'
            className={getInputClass("companyEmail")}
            {...register("companyEmail")}
            placeholder='Company Email'
          />
        </div>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Address</Label>
          <Input
            className={getInputClass("address")}
            {...register("address")}
            placeholder='Address'
          />
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Company Logo</Label>
          <Input
            type='file'
            accept='image/*'
            className='h-8 text-xs'
            onChange={(e) => handleFileUpload(e, "logo")}
          />
          {logoName && <p className='text-sm text-gray-400'>{logoName}</p>}
          {errors.logo && (
            <p className='text-red-500 text-xs'>{errors.logo.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>
            Supporting Document
          </Label>
          <Input
            type='file'
            accept='image/*'
            className='h-8 text-xs'
            onChange={(e) => handleFileUpload(e, "supportDocument")}
          />
          {docName && <p className='text-sm text-gray-400'>{docName}</p>}
          {errors.supportDocument && (
            <p className='text-red-500 text-xs'>
              {errors.supportDocument.message}
            </p>
          )}
        </div>
      </div>

      <h2 className='text-xs font-semibold mt-4 text-[#E2F163]/60 tracking-wider'>
        Operator Detail
      </h2>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Operator Name</Label>
          <Input
            className={getInputClass("operatorName")}
            {...register("operatorName")}
            placeholder='Full Name'
          />
        </div>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Phone Number</Label>
          <Input
            className={getInputClass("phone")}
            {...register("phone")}
            placeholder='Phone'
          />
        </div>
        <div className='space-y-2'>
          <Label className='font-normal text-gray-300'>Email</Label>
          <Input
            type='email'
            className={getInputClass("email")}
            {...register("email")}
            placeholder='Email'
          />
        </div>
        <div className='space-y-2 relative'>
          <Label className='font-normal text-gray-300'>Password</Label>
          <Input
            id='password'
            type={showPassword ? "text" : "password"}
            placeholder={"••••••••"}
            className={cn("h-8 pt-3 pr-10 peer", getInputClass("password"))}
            {...register("password")}
          />
          <button
            type='button'
            className='flex items-center absolute right-3 top-1/2 -translate-y-1/5 h-6'
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className='h-5 w-5 text-muted-foreground' />
            ) : (
              <Eye className='h-5 w-5 text-muted-foreground' />
            )}
          </button>
        </div>
      </div>

      <Button
        type='submit'
        className='mt-4 w-full !bg-primary-foreground/70 text-background h-10 px-8'
      >
        Submit
      </Button>
    </form>
  );
}

export default RegistrationForm;
