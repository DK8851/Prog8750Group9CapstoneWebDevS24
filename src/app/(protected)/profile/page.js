"use client";

import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, updateDoc, where, getDocs, query, collection, limit } from 'firebase/firestore';

import BG from '@/components/Bg';
import RoundButton from '@/components/RoundButton';
import firebase_app from '@/utils/firebase/firebase';

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const ProfilePage = () => {
    const router = useRouter();
    const [originalData, setOriginalData] = useState({ email: '', role: 'User', displayName: '' });
    const [formData, setFormData] = useState({ userEditId: '', email: '', role: 'User', displayName: '' });
    const [errors, setErrors] = useState({ userEditId: '', email: '', role: '', displayName: '' });

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {

            console.log("user :: ", user);
            if (user) {
                const userDocRef = collection(db, 'users');
                const _userDocQuery = query(userDocRef, where('uid', '==', user.uid), limit(1))

                const userDoc = await getDocs(_userDocQuery);
                if (userDoc.docs.length == 1) {

                    if (userDoc.docs[0].exists()) {
                        let _userData = userDoc.docs[0].data()

                        setFormData({
                            userEditId: userDoc.docs[0].id,
                            email: user.email,
                            role: _userData.role || 'User',
                            displayName: _userData.displayName || '',
                        });

                        setOriginalData({
                            email: user.email,
                            role: _userData.role || 'User',
                            displayName: _userData.displayName || '',
                        });
                    }
                }
            } else {
                router.push('/login');
            }
        });
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Resetting error message on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userEditId) {
            toast.error("Please Login First!")
            router.push("/login")
            return
        }

        let newErrors = {};

        if (!formData.displayName) {
            newErrors.displayName = 'Name is required';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const changedData = getChangedData();

        if (Object.keys(changedData).length === 0) {
            toast.info("No changes detected.");
            return;
        }

        await updateUserProfile(changedData);
    };

    const getChangedData = () => {
        const changedData = {};
        for (const key in formData) {
            if (formData[key] !== originalData[key] && key !== "userEditId") {
                changedData[key] = formData[key];
            }
        }
        return changedData;
    };

    const updateUserProfile = async (changedData) => {

        console.log(changedData);

        const updateProfileLoading = toast.loading("Please wait...");

        try {
            const userDocRef = doc(db, 'users', formData.userEditId);
            await updateDoc(userDocRef, changedData);

            toast.update(updateProfileLoading, { render: "Profile updated successfully", type: "success", isLoading: false, autoClose: true });
        } catch (error) {
            console.error(error);
            toast.update(updateProfileLoading, { render: "Failed to update profile", type: "error", isLoading: false, autoClose: true });
        }
    };

    return (
        <div>
            <BG />
            <div className='container py-5'>
                <h2 className='text-center fw-bolder'>
                    Update Profile
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
                            isInvalid={!!errors.email}
                            readOnly // Make email read-only
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicdisplayName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            className='rounded-pill'
                            type="text"
                            placeholder="Enter Name"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            isInvalid={!!errors.displayName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.displayName}
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
                            <option value="Responder">Responder </option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.role}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className='d-flex justify-content-center align-items-center'>
                        <RoundButton text="Update Profile" size='md' newclass="text-uppercase" />
                    </div>
                </Form>
            </div>
        </div >
    );
};

export default ProfilePage;
