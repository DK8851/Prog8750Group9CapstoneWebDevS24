"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import BG from "@/components/Bg";
import firebase_app from "@/utils/firebase/firebase";
import { Container, Table, Button, Pagination } from "react-bootstrap";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AdminVerifyDocPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchAllDocs();
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const fetchAllDocs = async () => {
    try {
      const docsRef = collection(db, "contactus");
      const querySnapshot = await getDocs(docsRef);
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocs(docsData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const updateDocStatus = async (docId, userEmail, updates) => {
    const updateLoading = toast.loading("Updating request status...");

    try {
      const docRef = doc(db, "contactus", docId);
      await updateDoc(docRef, updates);

      await sendEmail({
        to: userEmail,
        docId,
        status: updates.isChecked ? "Checked" : "Un Checked",
      });

      toast.update(updateLoading, {
        render: "Request status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      fetchAllDocs();
    } catch (error) {
      console.error("Error updating request status: ", error);

      toast.update(updateLoading, {
        render: "Failed to update request status",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const sendEmail = async ({ to, docId, status }) => {
    const message =
      "The status of your request has been updated. Here are the details:";
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, docId, status, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleReqCheck = (docId, userEmail, checked) => {
    updateDocStatus(docId, userEmail, {
      isChecked: checked,
    });
  };

  const deleteDocument = async (docId) => {
    const deleteDocLoading = toast.loading("Deleting document...");

    try {
      const docRef = doc(db, "contactus", docId);
      await deleteDoc(docRef);

      toast.update(deleteDocLoading, {
        render: "Req deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      fetchAllDocs();
    } catch (error) {
      console.error("Error deleting request! ", error);
      toast.update(deleteDocLoading, {
        render: "Failed to delete request",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = docs.slice(indexOfFirstDoc, indexOfLastDoc);

  const totalPages = Math.ceil(docs.length / docsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <BG />
      <div className="container py-5">
        <h2 className="text-center fw-bolder">Contact Us Request</h2>
        <Container>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Decision</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{indexOfFirstDoc + index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.subject}</td>
                  <td>{doc.description}</td>
                  <td>{doc.isChecked ? "Checked" : "Un Checked"}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleReqCheck(doc.id, doc.email, true)}
                    >
                      Checked
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReqCheck(doc.id, doc.email, false)}
                      className="ms-2 text-white"
                    >
                      UnChecked
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteDocument(doc.id)}
                      className="ms-2"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <Pagination.Item
                key={pageIndex + 1}
                active={pageIndex + 1 === currentPage}
                onClick={() => handlePageChange(pageIndex + 1)}
              >
                {pageIndex + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Container>
      </div>
    </div>
  );
};

export default AdminVerifyDocPage;
