"use client";

import "bootstrap/dist/css/bootstrap.min.css";

// modify color schema
import "/styles/scss/global.scss";
import "/styles/css/globals.css";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WithAdminAuthRedirect from "@/components/HOC/WithAdminAuthRedirect";

function ProtectedLayout({ children, user, userRole }) {
  const pathname = usePathname();
  console.log("admin side :: ", userRole);

  return (
    <div>
      <Header
        key={pathname}
        currActivePath={pathname}
        currUser={user}
        userRole={userRole}
      />
      <main>{children}</main>
      <Footer
        currActivePath={pathname}
        fixed={!["/profile", "/verify-doc"].includes(pathname)}
      />
    </div>
  );
}

export default WithAdminAuthRedirect(ProtectedLayout);
