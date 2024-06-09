"use client"

import 'bootstrap/dist/css/bootstrap.min.css';

// modify color schema
import "/styles/scss/global.scss";
import "/styles/css/globals.css";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import withAuthRedirect from '@/components/HOC/WithAuthRedirect';


function ProtectedLayout({ children, user }) {
  const pathname = usePathname();

  return (
    <div>
      <Header key={pathname} currActivePath={pathname} currUser={user} />
      <main>
        {children}
      </main>
      <Footer currActivePath={pathname} fixed={pathname != "/profile"} />
    </div>
  );
}

export default withAuthRedirect(ProtectedLayout)