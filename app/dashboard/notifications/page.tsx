"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import { Bell, Calendar, Check, Mail, MessageSquare, Monitor, Settings2, User } from "lucide-react"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "message" | "deadline" | "system" | "payment"
}

export default function NotificationsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    // No notifications table in DB yet — show empty state
    setLoading(false)
  }, [])

  if (!isMounted) {
    return null
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Notifications</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground mt-1">Stay updated with project activities and messages.</p>
              </div>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="self-start"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
              All
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full gradient-bg px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Unread</TabsTrigger>
            <TabsTrigger value="message" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Messages</TabsTrigger>
            <TabsTrigger value="deadline" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Deadlines</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {loading ? (
              <div className="bento-card p-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bento-card p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {activeTab === "unread"
                      ? "You've read all your notifications."
                      : "Notifications will appear here as you use ForgeMancer — project updates, task completions, and system events."}
                  </p>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bento-card p-4 animate-fade-in ${!notification.read ? "gradient-border" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        notification.type === "message"
                          ? "bg-blue-500/10 text-blue-500"
                          : notification.type === "deadline"
                            ? "bg-amber-500/10 text-amber-500"
                            : notification.type === "payment"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-violet-500/10 text-violet-500"
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`font-medium text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="h-7 w-7 p-0">
                              <Check className="h-3.5 w-3.5" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Notification Preferences */}
        <div className="bento-card overflow-hidden">
          <div className="p-5 border-b flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Notification Preferences</h3>
          </div>
          <div className="divide-y">
            {[
              {
                id: "email-notifications",
                icon: Mail,
                label: "Email Notifications",
                description: "Receive notifications via email",
                defaultChecked: true,
              },
              {
                id: "browser-notifications",
                icon: Monitor,
                label: "Browser Notifications",
                description: "Receive push notifications in your browser",
                defaultChecked: true,
              },
              {
                id: "project-updates",
                icon: Bell,
                label: "Project Updates",
                description: "Get notified about project changes",
                defaultChecked: true,
              },
              {
                id: "deadline-reminders",
                icon: Calendar,
                label: "Deadline Reminders",
                description: "Get reminded about upcoming deadlines",
                defaultChecked: true,
              },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <pref.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor={pref.id} className="text-sm font-medium cursor-pointer">{pref.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{pref.description}</p>
                  </div>
                </div>
                <Switch id={pref.id} defaultChecked={pref.defaultChecked} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
