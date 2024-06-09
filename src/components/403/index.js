import Link from 'next/link';
import { Button, Col, Row } from 'react-bootstrap';
import Container from "react-bootstrap/Container";

export default function Forbidden() {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "100vh" }}>
            <Container className="d-grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600">403</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Forbidden</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Sorry, you need to be logged in to access this page.</p>
                    <Row className="mt-10 justify-content-center">
                        <Col xs={12} md="auto">
                            <Link href="/">
                                <Button variant="primary" className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</Button>
                            </Link>
                        </Col>
                        <Col xs={12} md="auto" className="mt-3 mt-md-0 d-flex justify-content-center">
                            <Link href="/login" className="text-sm font-semibold text-gray-900 d-flex align-items-center">
                                Login Now! <span className="ms-2">&rarr;</span>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}
