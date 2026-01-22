'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GlobalSearch } from '@/components/file-manager/GlobalSearch';
import { FileItem } from '@/types/file';

interface HeaderProps {
    onSearch?: (query: string) => void;
    onFolderSelect?: (folderId: string) => void;
    onFileSelect?: (file: FileItem) => void;
}

export function Header({ onSearch, onFolderSelect, onFileSelect }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/login');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Virtual Locker
                            </h1>
                            <p className="text-xs text-gray-500">Secure File Storage</p>
                        </div>
                    </div>

                    {/* Global Search */}
                    <div className="flex-1 max-w-2xl flex justify-center">
                        <GlobalSearch
                            onSearch={onSearch}
                            onFolderSelect={onFolderSelect}
                            onFileSelect={onFileSelect}
                        />
                    </div>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full shrink-0">
                                <Avatar>
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                        {user?.username ? getInitials(user.username) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
