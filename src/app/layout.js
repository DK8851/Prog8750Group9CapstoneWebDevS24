import { Inter } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rapid Aid",
  description: "Rapid Aid is Community-Based Emergency System!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
