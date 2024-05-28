'use client'

import { Fugaz_One } from "next/font/google";
import { useState, useEffect } from 'react'
import Link from 'next/link'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Fugaz_One_md = Fugaz_One({
    weight: '400',
    subsets: ['latin'],
});


const Header = ({ currUser, priceLink, logoutCurrUser }) => {
    const [top, setTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setTop(window.scrollY < 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="py-2 py-sm-4">
            <Container>
                <Navbar.Brand as={Link} href="/" className={Fugaz_One_md.className}>
                    RapidAid
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} href="#home">Home</Nav.Link>
                        <Nav.Link as={Link} href="#about">About</Nav.Link>
                        <Nav.Link as={Link} href="#contact">Contact</Nav.Link>
                        <Nav.Link as={Link} href="#login">Login</Nav.Link>
                        <Nav.Link as={Link} href="#register">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;