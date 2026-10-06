import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimatedBackground } from "@/components/animated-background";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empire National | Dispatcher Onboarding",
  description:
    "Empire National's dispatcher onboarding and training platform — company overview, equipment training, compliance, and certification quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the saved theme before first paint, so the page never
            flashes the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('empire-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
