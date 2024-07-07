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

import BG from "@/components/Bg";
import firebase_app from "@/utils/firebase/firebase";
import { Container, Table, Button } from "react-bootstrap";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);

const AdminVerifyDocPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState([]);

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

  const updateDocStatus = async (docId, updates) => {
    const updateLoading = toast.loading("Updating document status...");

    try {
      const docRef = doc(db, "docs", docId);
      await updateDoc(docRef, updates);

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

  const handleApprove = (docId) => {
    updateDocStatus(docId, {
      isApproved: true,
      isPending: false,
      madeDecision: true,
    });
  };

  const handleReject = (docId) => {
    updateDocStatus(docId, {
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
              {docs.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
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
                      onClick={() => handleApprove(doc.id)}
                      disabled={doc.madeDecision}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(doc.id)}
                      disabled={doc.madeDecision}
                      className="ms-2"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteDocument(doc.id, doc.docUrls[0])}
                      className="ms-2"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
};

export default AdminVerifyDocPage;
