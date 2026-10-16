"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, UserPlus } from "lucide-react";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "doctor";
    timestamp: Date;
    read: boolean;
}

interface NotificationPayload {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    readAt: string | null;
}

const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "");

const NotificationDropdown = ({ enabled = false }: { enabled?: boolean }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    useEffect(() => {
        if (!enabled || !socketUrl) {
            return;
        }

        const socket = io(socketUrl, { withCredentials: true });
        socketRef.current = socket;

        const addNotification = (notification: NotificationPayload): Notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: "doctor",
            timestamp: new Date(notification.createdAt),
            read: notification.readAt !== null,
        });

        socket.on("connect", () => {
            socket.emit("notifications:list", (savedNotifications: NotificationPayload[]) => {
                setNotifications((current) => {
                    const currentById = new Map(current.map((item) => [item.id, item]));
                    const saved = savedNotifications.map((item) => currentById.get(item.id) ?? addNotification(item));
                    const savedIds = new Set(saved.map((item) => item.id));
                    return [...saved, ...current.filter((item) => !savedIds.has(item.id))]
                        .sort((first, second) => second.timestamp.getTime() - first.timestamp.getTime())
                        .slice(0, 20);
                });
            });
        });

        socket.on("notification:doctor-created", (notification: NotificationPayload) => {
            setNotifications((current) => [
                addNotification(notification),
                ...current,
            ].filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index)
                .slice(0, 20));
        });

        return () => {
            socketRef.current = null;
            socket.disconnect();
        };
    }, [enabled]);

    const markAsRead = (id: string) => {
        setNotifications((current) => current.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
        ));
        socketRef.current?.emit("notifications:read", id);
    };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0" variant="destructive">
                        <span className="text-[10px]">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    </Badge>
                )}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={"end"} className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
                <span>
                    Notifications
                </span>
                {
                    unreadCount > 0 && (
                        <Badge variant={"secondary"} className="ml-2">
                            {unreadCount} new
                        </Badge>
                    )
                }
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <ScrollArea className="h-75">
                {
                    notifications.length > 0 ? (
                        notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)} className="flex items-start gap-3 p-3 cursor-pointer">
                                <div className="mt-0.5">
                                    <UserPlus className="h-4 w-4 text-green-600" />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.title}
                                        </p>
                                        {
                                            !notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-blue-600"/>
                                            )
                                        }
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(notification.timestamp, {
                                            addSuffix: true
                                        })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) 
                }
            </ScrollArea>

            <DropdownMenuSeparator/>

        </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default NotificationDropdown