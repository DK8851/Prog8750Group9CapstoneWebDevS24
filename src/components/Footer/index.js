'use client'

import { useState, useEffect } from 'react'
import { BiChevronsRight } from "react-icons/bi";
import Container from 'react-bootstrap/Container';
import styles from './Footer.module.css';
import Link from 'next/link';

const navLinks = [
    { "path": "/", "text": "Home" },
    { "path": "/about", "text": "About" },
    { "path": "/contact", "text": "Contact" },
]
const Footer = ({ fixed, currActivePath }) => {
    const [top, setTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setTop(window.scrollY < 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`w-100 ${fixed ? styles.fixedFooter : ''}`}>
            <Container fluid className="bg-dark text-white py-4">
                <p className="text-center">
                    <label className="py-2">
                        Quick Links
                    </label>
                </p>
                <ul className="list-unstyled p-0 m-0 d-flex flex-column flex-md-row justify-content-around">
                    {(navLinks || [])?.map((item, index) => (
                        <li key={index} className="footer-li">
                            <BiChevronsRight />
                            <Link href={item.path} className={currActivePath === item.path ? 'active' : ''}>{item.text}</Link>
                        </li>
                    ))}
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