"use client";

import { useState } from "react";


import type { RegistrationFormData } from "@/components/registration-form";
import { Logo } from "@/components/logo";
import RegistrationForm from "@/components/registration-form";

export default function Registration() {
  const [registerData, setRegisterData] = useState<RegistrationFormData | null>(null);

  return (
   <div className='w-full h-screen grid grid-cols-10'>


{/* Left side */}
      <div className='col-span-4 h-screen m-auto'>
        <div className='w-[1px] mb-20 mx-auto mt-24'>
          <Logo />
        </div>
        <img
          src='/Addis_bus-removebg-preview.png'
          alt='Top Image'
          width={500}
          height={300}
          className='ml-24 w-[80vh] h-[50vh] object-contain '
        />
      </div>

 {/* Right side */}
      <div className='col-span-6 flex items-center justify-center  z-10 p-4 '>
        <div className='space-y-2 pt-2'>
          <h1 className='text-[#E2F163] !font-semibold !text-4xl'>Register here!</h1>
          <p className='text-base text-gray-400'>
            Let's get you all set up so you can access your Dirlink account
          </p>

          <RegistrationForm
            dataSetter={setRegisterData}
            onSubmission={() => {
              console.log({ registerData });
            }}
          />
        </div>
      </div>
    </div>
  );
}
