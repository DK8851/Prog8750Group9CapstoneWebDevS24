import Script from "next/script";
import dynamic from "next/dynamic";

import { Montserrat } from "next/font/google";

import "bootstrap/dist/css/bootstrap.min.css";
// modify color schema
import "/styles/scss/global.scss";
import "/styles/css/globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Montserrat_ds = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Rapid Aid",
  description: "Rapid Aid is Community-Based Emergency System!",
};

const CrispWithNoSSR = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={Montserrat_ds.className}>
        <CrispWithNoSSR />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
