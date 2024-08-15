"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
  limit,
  deleteDoc,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

import BG from "@/components/Bg";
import firebase_app from "@/utils/firebase/firebase";
import { Container, Table, Button, Pagination } from "react-bootstrap";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);

const AdminVerifyDocPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5; // Number of documents to display per page

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user is an admin
        const userDocRef = collection(db, "users");
        const _userDocQuery = query(
          userDocRef,
          where("uid", "==", user.uid),
          limit(1)
        );
        const userDoc = await getDocs(_userDocQuery);

        if (userDoc.docs.length === 1 && userDoc.docs[0].exists()) {
          const userData = userDoc.docs[0].data();
          if (userData) {
            fetchAllDocs();
          } else {
            toast.error("Access Denied");
            router.push("/");
          }
        }
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const fetchAllDocs = async () => {
    try {
      const docsRef = collection(db, "docs");
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

  const updateDocStatus = async (docId, userId, updates) => {
    const updateLoading = toast.loading("Updating document status...");

    try {
      const docRef = doc(db, "docs", docId);
      await updateDoc(docRef, updates);

      const userEmail = await fetchUserEmail(userId);

      await sendEmail({
        to: userEmail, // actual recipient's email
        docId,
        status: updates.isApproved ? "APPROVED" : "REJECTED",
      });

      toast.update(updateLoading, {
        render: "Document status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      fetchAllDocs();
    } catch (error) {
      console.error("Error updating document status: ", error);

      toast.update(updateLoading, {
        render: "Failed to update document status",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const fetchUserEmail = async (userId) => {
    try {
      const response = await fetch("/api/authById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user email");
      }

      const data = await response.json();
      return data?.response?.email;
    } catch (error) {
      console.error(error);
    }
  };

  const sendEmail = async ({ to, docId, status }) => {
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, docId, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleApprove = (docId, userId) => {
    updateDocStatus(docId, userId, {
      isApproved: true,
      isPending: false,
      madeDecision: true,
    });
  };

  const handleReject = (docId, userId) => {
    updateDocStatus(docId, userId, {
      isApproved: false,
      isPending: false,
      madeDecision: true,
    });
  };

  const deleteDocument = async (docId, url) => {
    const deleteDocLoading = toast.loading("Deleting document...");

    try {
      const docRef = doc(db, "docs", docId);
      await deleteDoc(docRef);

      const fileRef = ref(storage, url);
      await deleteObject(fileRef);

      toast.update(deleteDocLoading, {
        render: "Document deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      fetchAllDocs();
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.update(deleteDocLoading, {
        render: "Failed to delete document",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  // Pagination logic
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
        <h2 className="text-center fw-bolder">Admin Verify Documents</h2>
        <Container>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Document</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{indexOfFirstDoc + index + 1}</td>
                  <td>
                    <img
                      src={doc.docUrls[0]} // Assuming each doc entry has one URL
                      alt={`Document ${index + 1}`}
                      className="img-fluid"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </td>
                  <td>
                    {doc.isPending
                      ? "Pending"
                      : doc.isApproved
                      ? "Approved"
                      : "Rejected"}
                  </td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleApprove(doc.id, doc.userId)}
                      disabled={doc.madeDecision}
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(doc.id, doc.userId)}
                      disabled={doc.madeDecision}
                      className="ms-2"
                    >
                      <FaTimes />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteDocument(doc.id, doc.docUrls[0])}
                      className="ms-2"
                    >
                      <FaTrash />
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
