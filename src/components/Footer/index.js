'use client'

import { useState, useEffect } from 'react'
import { BiChevronsRight } from "react-icons/bi";
import Container from 'react-bootstrap/Container';

const Footer = () => {
    const [top, setTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setTop(window.scrollY < 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="position-fixed bottom-0 w-100">
            <Container fluid className="bg-dark text-white py-4">
                <p className="text-center">
                    <label className="py-2">
                        Quick Links
                    </label>
                </p>
                <ul className="list-unstyled p-0 m-0 d-flex flex-column flex-md-row justify-content-around">
                    <li className="footer-li">
                        <BiChevronsRight />
                        Home
                    </li>
                    <li className="footer-li">
                        <BiChevronsRight />
                        About Us
                    </li>
                    <li className="footer-li">
                        <BiChevronsRight />
                        Contact Us
                    </li>
                    <li className="footer-li">
                        <BiChevronsRight />
                        Our Team
                    </li>
                    <li className="footer-li">
                        <BiChevronsRight />
                        Login
                    </li>
                    <li className="footer-li">
                        <BiChevronsRight />
                        Register
                    </li>
                </ul>
            </Container>
            <hr className="m-0 p-0 border border-dark-subtle" />
            <Container fluid className="bg-dark text-white text-center">
                <label className="fs-6 py-2">
                    © RapidAid 2024 all rights reserved
                </label>
            </Container>
        </div>
    )
}

export default Footer;