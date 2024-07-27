"use client";

import "bootstrap/dist/css/bootstrap.min.css";

// modify color schema
import "/styles/scss/global.scss";
import "/styles/css/globals.css";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import withAuthRedirect from "@/components/HOC/WithAuthRedirect";
import React from "react";

function ProtectedLayout({ children, user, userRole }) {
  const pathname = usePathname();
  console.log("userRole :: ", userRole);

  return (
    <div>
      <Header
        key={pathname}
        currActivePath={pathname}
        currUser={user}
        userRole={userRole}
      />
      <main>{React.cloneElement(children, { userRole })}</main>
      <Footer
        currActivePath={pathname}
        fixed={!["/profile", "/verify-doc", "/emg"].includes(pathname)}
      />
    </div>
  );
}

export default withAuthRedirect(ProtectedLayout);
