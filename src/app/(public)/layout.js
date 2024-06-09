"use client"

import 'bootstrap/dist/css/bootstrap.min.css';

// modify color schema
import "/styles/scss/global.scss";
import "/styles/css/globals.css";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <div>
      <Header key={pathname} currActivePath={pathname} />
      <main>
        {children}
      </main>
      <Footer currActivePath={pathname} fixed={pathname != "/register"} />
    </div>
  );
}
