import Link from 'next/link';
import Header from '@/components/Header';
import { FileText, Bookmark, Sparkles, ArrowRight, Star, Tags, Search } from 'lucide-react';

export default function HomePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background gradient orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
                                <Sparkles className="h-4 w-4 text-primary-400" />
                                <span className="text-sm text-primary-300">Personal Knowledge Base</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-dark-100 via-dark-200 to-dark-300 bg-clip-text text-transparent">
                                    Your Notes &
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Bookmarks
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10">
                                Save, organize, and find your notes and bookmarks with powerful search and tagging.
                                Keep your digital life organized in one beautiful place.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/notes" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
                                    <FileText className="h-5 w-5" />
                                    View Notes
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="/bookmarks" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-3">
                                    <Bookmark className="h-5 w-5" />
                                    View Bookmarks
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 border-t border-dark-800/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-100 mb-4">
                                Everything you need
                            </h2>
                            <p className="text-dark-400">
                                Simple yet powerful features to manage your knowledge
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="card text-center p-8">
                                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                                    <Search className="h-7 w-7 text-primary-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-dark-100 mb-3">
                                    Powerful Search
                                </h3>
                                <p className="text-dark-400 text-sm">
                                    Find anything instantly with full-text search across all your notes and bookmarks
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="card text-center p-8">
                                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                    <Tags className="h-7 w-7 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-dark-100 mb-3">
                                    Tag Organization
                                </h3>
                                <p className="text-dark-400 text-sm">
                                    Organize with flexible tags and filter your content by multiple categories
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="card text-center p-8">
                                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                                    <Star className="h-7 w-7 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-dark-100 mb-3">
                                    Favorites
                                </h3>
                                <p className="text-dark-400 text-sm">
                                    Mark your most important items as favorites for quick access anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-dark-800/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-dark-500 text-sm">
                            Built with Next.js, Tailwind CSS & Express
                        </p>
                    </div>
                </footer>
            </main>
        </>
    );
}
