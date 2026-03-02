import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Football Livescore",
  description: "Real-time football scores, fixtures & standings from top leagues worldwide",
};

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Analytics />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              fontSize: '13px',
            },
          }}
        />
        <Header />
        <div className="pt-14">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
};

export default Rootlayout;


// Good but for the create news, they should be able to add image anywhere they want. like on ESPN or dev.to, if you are list top 20 athletes you'll add their picture before mention each athlete and stuff's like that (font, bold, underline and so on)

// mongodb+srv://qayyumoladimeji_db_user:ZXdk4hEnmhHgnIW2@football-livescore.3tsguqp.mongodb.net/?appName=football-livescore