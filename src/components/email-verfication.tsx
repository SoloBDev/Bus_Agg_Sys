import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Logo } from "./logo";
import axios from "axios";

interface LocationState {
  email: string;
}

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const email = state?.email;

  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpStatus, setOtpStatus] = useState<"success" | "error" | "">("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // useEffect(() => {
  //   if (email) {
  //     sendOtp(email);
  //   }
  // }, [email]);

  // const sendOtp = async (targetEmail: string) => {
  //   try {
  //     setIsSubmitting(true);
  //     const response = await axios.post(
  //       "https://n7gjzkm4-3001.euw.devtunnels.ms/api/verify-operator/verify-otp",
  //       { email: targetEmail }
        
  //     );
      
  //     console.log(response.data)
  //     console.log(response.status)

  //     if (response.status === 200) {
  //       toast.success(`OTP sent to ${targetEmail}`);
  //       setResendCooldown(30);
  //     } 
  //     // else {
  //     //   throw new Error(response.data.message || "Failed to send OTP");
  //     // }
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //     toast.error("Failed to send OTP. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length === 4 && index === 0) {
      // Autofill all fields if 4 digits are pasted into the first input
      const values = value.split("").slice(0, 4);
      setOtpValues(values);
      inputRefs.current[3]?.focus();
    } else {
      const updated = [...otpValues];
      updated[index] = value;
      setOtpValues(updated);
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setOtpStatus(""); // reset status on input
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otpValues.join("");

    if (code.length !== 4) {
      toast.error("Enter the full 4-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      // https://n7gjzkm4-3001.euw.devtunnels.ms/
      const response = await axios.post(
        "http://localhost:3001/api/verify-operator/verify-otp",
        {
          email,
          otp: code
        }
      );

      if (response.status === 200) {
        setOtpStatus("success");
        toast.success("Email verified successfully!");
        
        // Store the token if the backend returns one
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        
        setTimeout(() => navigate("/login"), 1000);
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setOtpStatus("error");
      
      let errorMessage = "Incorrect OTP. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.response.status === 404) {
          errorMessage = "OTP expired. Please request a new one.";
        }
      }
      
      toast.error(errorMessage);
      setOtpValues(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto p-6 pt-8 w-7xl">
      <Card className="max-w-md w-full shadow-lg border border-muted">
        <CardContent className="flex flex-col items-center space-y-8 px-12 w-full !pt-8 !pb-2l">
          <Logo />

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Verify Your Email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a 4-digit code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {otpValues.map((digit, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                className={`w-12 h-12 border rounded-md text-center text-xl font-semibold focus:outline-none focus:ring-2 
                  ${
                    otpStatus === "success"
                      ? "border-green-500 ring-green-500"
                      : otpStatus === "error"
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  }`}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <ReloadIcon className="animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center pt-2">
            <Button
              variant="ghost"
              className="text-sm underline"
              disabled={resendCooldown > 0 || isSubmitting}
            >
              {resendCooldown > 0
                ? `Resend Code in ${resendCooldown}s`
                : "Resend OTP"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;