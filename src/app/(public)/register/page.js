"use client";

import RoundButton from '@/components/RoundButton';
import Link from 'next/link';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import BG from '@/components/Bg';
// import db from '@/utils/firebase/firestore'
// import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import firebase_app from '@/utils/firebase/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const auth = getAuth(firebase_app);


const RegisterPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', role: 'User' });
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', role: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Resetting error message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await registerUser();
  };

  const registerUser = async () => {
    const { email, password, role } = formData;
    const registerUserloading = toast.loading("Please wait...")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userInfo = {
        info: user?.reloadUserInfo,
        token: user?.accessToken
      };

      console.log("userCredential ::: ", userInfo);

      const uid = user.uid;

      await setUserRole(uid, role);
      toast.update(registerUserloading, { render: "Register Successfully", type: "success", isLoading: false, autoClose: true });
      router.push('/');


    } catch (error) {
      console.error(error);
      if (error.message.includes("auth/email-already-in-use")) {
        setErrors((prev) => ({ ...prev, email: "Email is already in use" }));
      }

      toast.update(registerUserloading, { render: "Please solve the below error!", type: "warning", isLoading: false, autoClose: true });
    }
  };

  const setUserRole = async (uid, role) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, role }),
      });

      await response.json();

    } catch (error) {
      console.error('Error setting user role:', error);
      throw new Error('Failed to set user role');
    }
  };

  return (
    <div>
      <BG />
      <div className='container py-5'>
        <h2 className='text-center fw-bolder'>
          Register
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

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              className='rounded-pill'
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              className='rounded-pill'
              name="role"
              value={formData.role}
              onChange={handleChange}
              isInvalid={!!errors.role}
            >
              <option value="User">User</option>
              <option value="Responder">Responder</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>

          <div className='d-flex justify-content-center align-items-center'>
            <RoundButton text="Register" size='md' newclass="text-uppercase" />
          </div>
          <div className='d-flex justify-content-center align-items-center mt-2'>
            <Link href="/login" className='fw-semibold text-body-secondary'>
              Already Register?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
