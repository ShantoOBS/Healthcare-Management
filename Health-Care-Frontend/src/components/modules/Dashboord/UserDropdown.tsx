"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/types/user.types"
import { Key, LogOut, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLogout } from "@/hooks/useLogout"

interface UserDropdownProps {
    userInfo: UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
    const { mutate: handleLogout, isPending } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center
                 gap-2.5 p-1 pr-3 rounded-full hover:bg-[#f4f7f5] transition">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#e0eae5] bg-[#1f5c4b] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {userInfo.image ? (
                            <Image src={userInfo.image} alt={userInfo.name} fill className="object-cover" />
                        ) : (
                            userInfo.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-xs font-bold text-[#1a2d29] leading-tight truncate max-w-[120px]">
                            {userInfo.name}
                        </span>
                        <span className="text-[10px] text-[#7a8c87] capitalize font-medium">
                            {userInfo.role.toLowerCase().replace("_", " ")}
                        </span>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={"end"} className="w-56 
            rounded-md p-2 border-[#e5ebe7] shadow-xl">
                <DropdownMenuLabel className="p-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-[#1a2d29]">
                            {userInfo.name}
                        </p>

                        <p className="text-xs text-[#7a8c87]">
                            {userInfo.email}
                        </p>

                        <p className="text-xs text-[#1f5c4b] font-semibold capitalize">
                            {userInfo.role.toLowerCase().replace("_", " ")}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#f0f4f2]" />

                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link href={"/my-profile"} className="flex items-center w-full px-2 py-2 text-xs font-semibold text-[#1a2d29]">
                        <User className="mr-2 h-4 w-4 text-[#5e716c]" />
                        My Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link href={"/change-password"} className="flex items-center w-full px-2 py-2 text-xs font-semibold text-[#1a2d29]">
                        <Key className="mr-2 h-4 w-4 text-[#5e716c]" />
                        Change Password
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#f0f4f2]" />

                <DropdownMenuItem
                    disabled={isPending}
                    onClick={() => handleLogout()}
                    className="rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 px-2 py-2 text-xs font-semibold"
                >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    {isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown

