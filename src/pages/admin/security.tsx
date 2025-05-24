"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Switch } from "../../components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import { Lock, Shield, UserCheck, Activity } from "lucide-react"

export default function AdminSecurityPage() {
  const { toast } = useToast()
  const [passwordLength, setPasswordLength] = useState(12)
  const [requireUppercase, setRequireUppercase] = useState(true)
  const [requireNumbers, setRequireNumbers] = useState(true)
  const [requireSymbols, setRequireSymbols] = useState(true)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5)

  // Mock security audit logs
  const auditLogs = [
    {
      id: "1",
      user: "admin@addisbus.com",
      action: "Login",
      ip: "192.168.1.1",
      timestamp: "2023-05-18 14:32:45",
      status: "success",
    },
    {
      id: "2",
      user: "tenant@abaybus.com",
      action: "Password Change",
      ip: "192.168.1.2",
      timestamp: "2023-05-18 13:15:22",
      status: "success",
    },
    {
      id: "3",
      user: "unknown@mail.com",
      action: "Login",
      ip: "192.168.1.3",
      timestamp: "2023-05-18 12:45:11",
      status: "failed",
    },
    {
      id: "4",
      user: "admin@addisbus.com",
      action: "User Creation",
      ip: "192.168.1.1",
      timestamp: "2023-05-18 11:22:05",
      status: "success",
    },
    {
      id: "5",
      user: "operator@addisbus.com",
      action: "Permission Change",
      ip: "192.168.1.4",
      timestamp: "2023-05-18 10:17:33",
      status: "success",
    },
  ]

  // Mock active sessions
  const activeSessions = [
    {
      id: "1",
      user: "admin@addisbus.com",
      device: "Chrome / Windows",
      ip: "192.168.1.1",
      lastActive: "2 minutes ago",
      location: "Addis Ababa, Ethiopia",
    },
    {
      id: "2",
      user: "tenant@abaybus.com",
      device: "Safari / macOS",
      ip: "192.168.1.2",
      lastActive: "5 minutes ago",
      location: "Addis Ababa, Ethiopia",
    },
    {
      id: "3",
      user: "operator@addisbus.com",
      device: "Firefox / Ubuntu",
      ip: "192.168.1.4",
      lastActive: "15 minutes ago",
      location: "Addis Ababa, Ethiopia",
    },
  ]

  const handleSavePasswordPolicy = () => {
    toast({
      title: "Password policy updated",
      description: "Your password policy settings have been saved successfully.",
    })
  }

  const handleSaveLoginPolicy = () => {
    toast({
      title: "Login policy updated",
      description: "Your login policy settings have been saved successfully.",
    })
  }

  const handleTerminateSession = (id: string) => {
    toast({
      title: "Session terminated",
      description: `Session ${id} has been terminated successfully.`,
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Security</h2>
        </div>

        <Tabs defaultValue="password" className="space-y-4">
          <TabsList>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Password Policy
            </TabsTrigger>
            <TabsTrigger value="login">
              <Shield className="mr-2 h-4 w-4" />
              Login Security
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <UserCheck className="mr-2 h-4 w-4" />
              Active Sessions
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Activity className="mr-2 h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements for all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-length">Minimum Password Length</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="password-length"
                      type="number"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number.parseInt(e.target.value))}
                      min={8}
                      max={32}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">characters</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one uppercase letter
                      </p>
                    </div>
                    <Switch id="require-uppercase" checked={requireUppercase} onCheckedChange={setRequireUppercase} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-numbers">Require Numbers</Label>
                      <p className="text-sm text-muted-foreground">Password must contain at least one number</p>
                    </div>
                    <Switch id="require-numbers" checked={requireNumbers} onCheckedChange={setRequireNumbers} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-symbols">Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one special character
                      </p>
                    </div>
                    <Switch id="require-symbols" checked={requireSymbols} onCheckedChange={setRequireSymbols} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="password-history">Password History</Label>
                      <p className="text-sm text-muted-foreground">Prevent reuse of the last 5 passwords</p>
                    </div>
                    <Switch id="password-history" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="password-expiry">Password Expiry</Label>
                      <p className="text-sm text-muted-foreground">Force password reset every 90 days</p>
                    </div>
                    <Switch id="password-expiry" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePasswordPolicy}>Save Password Policy</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Login Security</CardTitle>
                <CardDescription>Configure login security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Maximum Login Attempts</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="max-attempts"
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(Number.parseInt(e.target.value))}
                      min={3}
                      max={10}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">attempts</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                    </div>
                    <Switch id="2fa" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ip-restriction">IP Restriction</Label>
                      <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
                    </div>
                    <Switch id="ip-restriction" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users after 30 minutes
                      </p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="concurrent-sessions">Limit Concurrent Sessions</Label>
                      <p className="text-sm text-muted-foreground">Limit users to one active session at a time</p>
                    </div>
                    <Switch id="concurrent-sessions" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveLoginPolicy}>Save Login Security</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>View and manage currently active user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Device / Browser</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.user}</TableCell>
                        <TableCell>{session.device}</TableCell>
                        <TableCell>{session.ip}</TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleTerminateSession(session.id)}>
                            Terminate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Refresh</Button>
                <Button variant="destructive" className="ml-2">
                  Terminate All Sessions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Logs</CardTitle>
                <CardDescription>Review security-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "success" ? "default" : "destructive"}>{log.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Export Logs</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
