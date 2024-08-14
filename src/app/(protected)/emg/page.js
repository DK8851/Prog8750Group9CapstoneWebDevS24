"use client";

import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import BG from "@/components/Bg";
import RoundButton from "@/components/RoundButton";
import firebase_app from "@/utils/firebase/firebase";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const EmgPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    location: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    location: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Resetting error message on change
  };

  // Helper function to validate URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.desc) {
      newErrors.desc = "Description is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    } else if (!isValidURL(formData.location)) {
      newErrors.location = "Enter a valid URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await addNewEmergency();
  };

  const addNewEmergency = async () => {
    const addDocLoading = toast.loading("Please wait...");

    try {
      const user = getAuth().currentUser; // Get the current user
      if (!user) throw new Error("User not authenticated");

      const itemDocRef = collection(db, "emergency");
      await addDoc(itemDocRef, {
        uid: user.uid, // Store the user ID
        title: formData.title,
        desc: formData.desc,
        location: formData.location,
        createdAt: new Date(), // Optional: timestamp for when the record was created
      });

      toast.update(addDocLoading, {
        render: "Emergency added successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      setFormData({ title: "", desc: "", location: "" }); // Reset form data
    } catch (error) {
      console.error(error);
      toast.update(addDocLoading, {
        render: "Failed to add emergency",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  return (
    <div>
      <BG />
      <div className="container py-5">
        <h2 className="text-center fw-bolder">Add Emergency</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              className="rounded-pill"
              type="text"
              placeholder="Enter Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              className="rounded-pill"
              type="text"
              placeholder="Enter Description"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              isInvalid={!!errors.desc}
            />
            <Form.Control.Feedback type="invalid">
              {errors.desc}
            </Form.Control.Feedback>
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              className="rounded-pill"
              type="url"
              placeholder="Enter Location (e.g., https://map.com/jioenjzajs)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              isInvalid={!!errors.location}
            />
            <Form.Control.Feedback type="invalid">
              {errors.location}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              className="rounded"
              rows={4}
              placeholder="Enter Description"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              isInvalid={!!errors.desc}
            />
            <Form.Control.Feedback type="invalid">
              {errors.desc}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center align-items-center">
            <RoundButton
              text="Add Emergency"
              size="md"
              newclass="text-uppercase"
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EmgPage;
