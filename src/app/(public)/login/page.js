"use client"

import RoundButton from '@/components/RoundButton';
import Link from 'next/link';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import "./style.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Resetting error message on change
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Call your API with formData
        console.log('Form data:', formData);
    };

    return (
        <div>
            <div className="bg">
            </div>
            <div className='container py-4'>
                <h2 className='text-center fw-bolder'>
                    Login
                </h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            className='rounded-pill'
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className='rounded-pill'
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className='d-flex justify-content-center align-items-center'>
                        <RoundButton text="Login" size='md' newclass="text-uppercase" />
                    </div>
                    <div className='d-flex justify-content-center align-items-center mt-2'>
                        <Link href={"/register"} className='fw-semibold text-body-secondary'>
                            Create Your Account?
                        </Link>
                    </div>
                </Form>
            </div>
        </div>

    );
};

export default LoginPage;
