import './globals.css';

export const metadata = {
    title: 'Notes & Bookmarks Manager',
    description: 'Personal notes and bookmark manager application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
                {children}
            </body>
        </html>
    );
}
