"use client";

import RoundButton from "@/components/RoundButton";
import Link from "next/link";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import BG from "@/components/Bg";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ContactUsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Resetting error message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await sendContactForm();
  };

  const sendContactForm = async () => {
    const { name, email, subject, description } = formData;
    const contactFormLoading = toast.loading("Sending...");

    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, description }),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", subject: "", description: "" });
        toast.update(contactFormLoading, {
          render: "Message Sent Successfully!",
          type: "success",
          isLoading: false,
          autoClose: true,
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.update(contactFormLoading, {
        render: "Failed to Send Message!",
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
        <h2 className="text-center fw-bolder">Stay With us</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="rounded-pill"
              type="text"
              placeholder="Enter Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="rounded-pill"
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

          <Form.Group className="mb-3" controlId="formSubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              className="rounded-pill"
              type="text"
              placeholder="Enter Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              isInvalid={!!errors.subject}
            />
            <Form.Control.Feedback type="invalid">
              {errors.subject}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              className="rounded"
              rows={4}
              placeholder="Enter Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center align-items-center">
            <RoundButton
              text="Submit Now"
              size="md"
              newclass="text-uppercase"
            />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2">
            <Link href="/" className="fw-semibold text-body-secondary">
              Back to Home
            </Link>
          </div>
        </Form>

        <div className="mt-5">
          <h3 className="text-center">Find Us Here</h3>
          <div className="map-container mt-3">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2867.079189439161!2d-80.5252219!3d43.4786859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf3f470cbbb05%3A0x62734dcc1110cc0d!2s308%20King%20Street%20North%2C%20Waterloo%2C%20ON!5e0!3m2!1sen!2sca!4v1627294073358!5m2!1sen!2sca`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
