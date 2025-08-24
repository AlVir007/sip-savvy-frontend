import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast'; // Add this import
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sip & Savvy - Virtual Newsroom",
  description: "AI-powered newsroom for the drinks & HoReCa industry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster position="top-right" /> {/* Add this component */}
        </AuthProvider>
      </body>
    </html>
  );
}