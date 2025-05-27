"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PendingApprovalPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.status === "active") {
      navigate("/login")
    }
  }, [user, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-yellow-500 mr-2" />
            <span>Approval Pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>Your tenant registration is under review by our team.</p>
          <p>We'll notify you via email once your account is approved.</p>
          <div className="pt-4">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}