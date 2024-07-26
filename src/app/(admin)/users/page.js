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
  query,
  where,
} from "firebase/firestore";

import BG from "@/components/Bg";
import firebase_app from "@/utils/firebase/firebase";
import { Container, Table, Button } from "react-bootstrap";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AdminVerifyDocPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState([]);

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
      const docsRef = collection(db, "users");
      const querySnapshot = await getDocs(docsRef);
      let docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(docsData);

      docsData = docsData.filter((d) => d.role !== "SuperAdmin");
      setDocs(docsData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const updateDocStatus = async (id, docId, updates) => {
    const updateLoading = toast.loading("Updating request status...");

    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, updates);

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

  const handleUser = (id, docId, disabled) => {
    updateDocStatus(id, docId, {
      isDisable: disabled,
    });
  };

  const deleteDocument = async (id, uid) => {
    const deleteDocLoading = toast.loading("Deleting document...");

    try {
      // delete by calling firebase admin api
      const response = await fetch(`/api/auth/${uid}?id=${uid}`, {
        method: "DELETE",
      });

      const deletedFromFirebaseAdmin = await response.json();

      console.log("Deleted From Firebase Admin :: ", deletedFromFirebaseAdmin);
      // Reference to the users collection
      const usersCollection = collection(db, "users");

      // Create a query against the collection to find the document by UID
      const q = query(usersCollection, where("uid", "==", uid));

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Loop through the query results
      querySnapshot.forEach(async (userDoc) => {
        // Get document ID
        const userId = userDoc.id;

        // Reference to the specific document
        const userRef = doc(db, "users", userId);

        // Delete the document
        await deleteDoc(userRef);
        console.log(`User with UID ${uid} deleted successfully`);
      });

      toast.update(deleteDocLoading, {
        render: "user deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      fetchAllDocs();
    } catch (error) {
      console.error("Error deleting user! ", error);
      toast.update(deleteDocLoading, {
        render: "Failed to delete user",
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
        <h2 className="text-center fw-bolder">All Users</h2>
        <Container>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.displayName}</td>
                  <td>{doc.role}</td>
                  <td>{doc.isDisable ? "Disabled" : "Active"}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleUser(doc.id, doc.uid, false)}
                    >
                      Active
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleUser(doc.id, doc.uid, true)}
                      className="ms-2 text-white"
                    >
                      Deactive
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteDocument(doc.id, doc.uid)}
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
