"use client";

import { Fugaz_One } from "next/font/google";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import firebase_app from "@/utils/firebase/firebase";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "next/navigation";

const Fugaz_One_md = Fugaz_One({
  weight: "400",
  subsets: ["latin"],
});

const navLinks = [
  { path: "/", text: "Home" },
  { path: "/about", text: "About" },
  { path: "/contact", text: "Contact" },
];

const Header = ({ currActivePath, currUser, userRole }) => {
  const router = useRouter();
  const handleLogout = async () => {
    const auth = getAuth(firebase_app);
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  console.log("currUser :: ", currUser);

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="py-2 py-sm-4">
      <Container>
        <Navbar.Brand as={Link} href="/" className={Fugaz_One_md.className}>
          RapidAid
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userRole?.role !== "SuperAdmin" &&
              navLinks.map((item, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  href={item.path}
                  className={currActivePath === item.path ? "active" : ""}
                >
                  {item.text}
                </Nav.Link>
              ))}
            {currUser ? (
              <>
                <Nav.Link
                  as={Link}
                  href="/profile"
                  className={currActivePath === "/profile" ? "active" : ""}
                >
                  Profile
                </Nav.Link>

                {userRole?.role == "Responder" && (
                  <Nav.Link
                    as={Link}
                    href="/verify-doc"
                    className={currActivePath === "/verify-doc" ? "active" : ""}
                  >
                    Verify Doc
                  </Nav.Link>
                )}

                {userRole?.role == "SuperAdmin" && (
                  <Nav.Link
                    as={Link}
                    href="/verification-req"
                    className={
                      currActivePath === "/verification-req" ? "active" : ""
                    }
                  >
                    Verification Req
                  </Nav.Link>
                )}

                {userRole?.role == "SuperAdmin" && (
                  <Nav.Link
                    as={Link}
                    href="/contact-req"
                    className={
                      currActivePath === "/contact-req" ? "active" : ""
                    }
                  >
                    Contact Req
                  </Nav.Link>
                )}

                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  href="/login"
                  className={currActivePath === "/login" ? "active" : ""}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/register"
                  className={currActivePath === "/register" ? "active" : ""}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
