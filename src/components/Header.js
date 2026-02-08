'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FileText, Bookmark, Home, Sparkles, LogIn, LogOut, User } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/notes', label: 'Notes', icon: FileText },
        { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-dark-800/50 bg-dark-900/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                            <div className="relative bg-dark-900 rounded-lg p-2">
                                <Sparkles className="h-5 w-5 text-primary-400" />
                            </div>
                        </div>
                        <span className="text-lg font-semibold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                            Notes & Bookmarks
                        </span>
                    </Link>

                    {/* Navigation + Auth */}
                    <div className="flex items-center gap-4">
                        <nav className="flex items-center gap-1">
                            {navItems.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                            : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Auth Section */}
                        <div className="flex items-center gap-2 pl-4 border-l border-dark-700">
                            {status === 'loading' ? (
                                <div className="w-8 h-8 rounded-full bg-dark-800 animate-pulse" />
                            ) : session ? (
                                <>
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50">
                                        <User className="h-4 w-4 text-primary-400" />
                                        <span className="text-sm text-dark-300">{session.user.name || session.user.email}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30 transition-colors"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
