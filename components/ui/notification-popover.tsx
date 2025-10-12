"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success" | "urgent";
}

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Training Module Available",
      description: "Module 3: Emergency Response Protocols is now available",
      timestamp: "2 hours ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "System Maintenance",
      description: "Scheduled maintenance this weekend from 2 AM to 4 AM",
      timestamp: "1 day ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Certificate Achieved",
      description: "You've earned your Fire Safety Certificate",
      timestamp: "3 days ago",
      read: true,
      type: "success",
    },
    {
      id: "4",
      title: "Important Update",
      description: "New fire safety regulations have been published",
      timestamp: "1 week ago",
      read: true,
      type: "info",
    },
    {
      id: "5",
      title: "Training Reminder",
      description: "Your refresher course is due next week",
      timestamp: "1 week ago",
      read: true,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <Bell className="h-4 w-4 text-destructive" />;
      case "warning":
        return <Bell className="h-4 w-4 text-yellow-50" />;
      case "success":
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-destructive";
      case "warning":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
 };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-red-200 text-red-700 hover:bg-red-50 relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[450px]">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md transition-colors ${
                      !notification.read 
                        ? "bg-accent/50 hover:bg-accent/70" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${getNotificationBadge(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-auto p-1 text-xs opacity-0 group-hover:opacity-100"
                      >
                        {!notification.read ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <CheckCheck className="h-3 w-3 text-green-50" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
