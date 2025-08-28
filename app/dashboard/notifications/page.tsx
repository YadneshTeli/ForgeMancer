"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import { Bell, Calendar, Check, MessageSquare, User } from "lucide-react"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "message" | "deadline" | "system" | "payment"
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New message from client",
    description: "Sarah from Acme Inc. sent you a message about the Website Redesign project.",
    time: "10 minutes ago",
    read: false,
    type: "message",
  },
  {
    id: "2",
    title: "Project deadline approaching",
    description: "The Mobile App project is due in 3 days.",
    time: "1 hour ago",
    read: false,
    type: "deadline",
  },
  {
    id: "3",
    title: "Invoice payment received",
    description: "Payment of $1,500 for the Branding Project has been received.",
    time: "Yesterday",
    read: true,
    type: "payment",
  },
  {
    id: "4",
    title: "New team member added",
    description: "Mike Johnson has been added to the Website Redesign project.",
    time: "2 days ago",
    read: true,
    type: "system",
  },
  {
    id: "5",
    title: "AI assistant completed task",
    description: "GPT-4 has generated the content strategy document you requested.",
    time: "3 days ago",
    read: true,
    type: "system",
  },
]

export default function NotificationsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const markAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const filteredNotifications =
    activeTab === "all"
      ? localNotifications
      : activeTab === "unread"
        ? localNotifications.filter((n) => !n.read)
        : localNotifications.filter((n) => n.type === activeTab)

  const unreadCount = localNotifications.filter((n) => !n.read).length

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with project activities and messages</p>
          </div>
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="deadline">Deadlines</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "unread"
                      ? "You've read all your notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`animate-fade-in ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          notification.type === "message"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : notification.type === "deadline"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                              : notification.type === "payment"
                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                        }`}
                      >
                        {notification.type === "message" ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : notification.type === "deadline" ? (
                          <Calendar className="h-4 w-4" />
                        ) : notification.type === "payment" ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
              <Switch id="browser-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="project-updates">Project Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about project changes</p>
              </div>
              <Switch id="project-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="deadline-reminders">Deadline Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming deadlines</p>
              </div>
              <Switch id="deadline-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
