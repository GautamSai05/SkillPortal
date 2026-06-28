import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "SkillPortal – Skill Assessment & SHL Practice Platform",
  description: "Professional platform for SHL-style aptitude, reasoning, verbal, and technical assessments with real-time proctoring and analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1e293b',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: '1rem',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
                fontWeight: '500',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#ecfdf5' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fef2f2' } },
            }}
          />
          
        </AuthProvider>
      </body>
    </html>
  );
}
