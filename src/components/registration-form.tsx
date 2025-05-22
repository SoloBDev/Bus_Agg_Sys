"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

export interface RegistrationFormData {
  companyName: string;
  serviceType: string;
  transportType: string;
  TIN: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  contactPersonGender: string;
  supportDocument: File | null;
}

interface RegistrationProps {
  dataSetter: (data: RegistrationFormData) => void;
  onSubmission: () => void;
}

const schema = yup.object({
  companyName: yup.string().required("Company name is required"),
  serviceType: yup.string().required("Select a service type"),
  transportType: yup.string().required("Select a transport type"),
  TIN: yup.string().required("TIN is required"),
  companyPhone: yup.string().required("Phone is required"),
  companyEmail: yup.string().email("Invalid email").required("Email is required"),
  companyAddress: yup.string().required("Address is required"),
  contactPersonName: yup.string().required("Full name is required"),
  contactPersonPhone: yup.string().required("Phone is required"),
  contactPersonEmail: yup.string().email("Invalid email").required("Email is required"),
  contactPersonGender: yup.string().required("Gender is required"),
  supportDocument: yup
    .mixed<File>()
    .nullable()
    .defined()
    .test("fileSize", "File is too large", (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024); // Optional 10MB limit
    }),
});

function RegistrationForm({ dataSetter, onSubmission }: RegistrationProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: "",
      serviceType: "",
      transportType: "",
      TIN: "",
      companyAddress: "",
      companyPhone: "",
      contactPersonName: "",
      contactPersonPhone: "",
      contactPersonEmail: "",
      contactPersonGender: "",
      supportDocument: null,
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    // Check for errors before submission
    if (Object.keys(errors).length > 0) {
      // Highlight all error fields
      Object.keys(errors).forEach((field) => {
        setError(field as keyof RegistrationFormData, {
          type: "manual",
          message: errors[field as keyof RegistrationFormData]?.message,
        });
      });
      
      // Show first error in toast
      const firstError = Object.keys(errors)[0];
      toast.error(errors[firstError as keyof RegistrationFormData]?.message);
      return;
    }

    dataSetter(data);
    onSubmission();
    toast.success("Registration successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/signup");
    }, 2000);
  };

  const supportDocument = watch("supportDocument");

  // Helper function to apply error styles
  const getInputClass = (fieldName: keyof RegistrationFormData) => {
    return errors[fieldName] 
      ? "h-8 text-xs border-red-500 focus:ring-red-500 focus:border-red-500" 
      : "h-8 text-xs";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <h2 className="text-xs font-semibold mt-4 text-[#E2F163]/60 tracking-wider">Company Detail</h2>

      <div className="space-y-2">
        <Label className="font-normal text-gray-300">Company Name</Label>
        <Input 
          className={getInputClass("companyName")}
          {...register("companyName")}
          placeholder="Company name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-normal text-gray-300">TIN</Label>
          <Input 
            className={getInputClass("TIN")}
            {...register("TIN")}
            placeholder="TIN Number"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-normal text-gray-300">Company Phone</Label>
          <Input 
            type="number" 
            className={getInputClass("companyPhone")}
            {...register("companyPhone")}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-normal text-gray-300">Company Email</Label>
          <Input 
            type="email" 
            className={getInputClass("companyEmail")}
            {...register("companyEmail")}
            placeholder="Company Email"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-normal text-gray-300">Company Address</Label>
          <Input 
            className={getInputClass("companyAddress")}
            {...register("companyAddress")}
            placeholder="Address"
          />
        </div>
      </div>

      <h2 className="text-xs font-semibold mt-4 text-[#E2F163]/60 tracking-wider">Contact Person</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-normal text-gray-300">Full Name</Label>
          <Input 
            className={getInputClass("contactPersonName")}
            {...register("contactPersonName")}
            placeholder="Contact person name"
          />
        </div>
        <div className="space-y-1">
          <Label className="font-normal text-gray-300">Phone Number</Label>
          <Input 
            className={getInputClass("contactPersonPhone")}
            {...register("contactPersonPhone")}
            placeholder="Contact phone"
          />
        </div>
        <div className="-mt-4">
          <Label className="font-normal text-gray-300">Email</Label>
          <Input 
            className={getInputClass("contactPersonEmail")}
            {...register("contactPersonEmail")}
            placeholder="Contact email"
          />
        </div>
        <div className=" flex flex-col">
          <Label className="font-normal text-gray-300 !mt-0 !mb-2">Gender</Label>
          <Controller 
            name="contactPersonGender"
            control={control}
            render={({ field }) => (
              <RadioGroup 
                {...field} 
                onValueChange={field.onChange}
                className={`flex gap-6 ${errors.contactPersonGender ? "text-red-500" : ""}`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="male" 
                    id="male" 
                    className={errors.contactPersonGender ? "border-red-500" : ""}
                  />
                  <Label className="text-xs font-light" htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="female" 
                    id="female" 
                    className={errors.contactPersonGender ? "border-red-500": ""}
                  />
                  <Label className="text-xs font-light" htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-normal text-gray-300">Upload Supporting Document</Label>
        <Input 
          className={`h-8 text-xs ${errors.supportDocument ? "border-red-500" : ""}`}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setValue("supportDocument", file);
          }}
        />
        {supportDocument && (
          <p className="text-sm text-gray-600">{supportDocument.name}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="mt-4 w-full !bg-primary-foreground/70 text-background h-10 px-8"
      >
        Submit
      </Button>
    </form>
  );
}

export default RegistrationForm;