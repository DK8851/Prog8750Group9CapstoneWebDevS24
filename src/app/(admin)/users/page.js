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
  limit,
  startAt,
  orderBy,
  startAfter,
} from "firebase/firestore";

import BG from "@/components/Bg";
import firebase_app from "@/utils/firebase/firebase";
import { Container, Table, Button } from "react-bootstrap";
import { FaCheckCircle, FaBan, FaTrash } from "react-icons/fa";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AdminVerifyDocPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // 5 items per page
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Reset pagination when a new session starts
        setCurrentPage(1);
        setDocs([]);
        fetchAllDocs();
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const fetchAllDocs = async (page = 1) => {
    try {
      const docsRef = collection(db, "users");

      // Apply ordering by a field (e.g., creation time) to paginate efficiently
      const orderedQuery = query(
        docsRef,
        where("role", "!=", "SuperAdmin"),
        orderBy("displayName"), // Replace "creationTime" with the correct field
        limit(pageSize)
      );

      // Adjust the query based on the page number
      let paginatedQuery = orderedQuery;

      if (page > 1) {
        const previousPageSnapshot = await getDocs(orderedQuery);
        const lastVisible =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
        paginatedQuery = query(orderedQuery, startAfter(lastVisible));
      }

      const paginatedSnapshot = await getDocs(paginatedQuery);

      const fetchedDocs = paginatedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocs(fetchedDocs);

      // Calculate total documents for pagination (this could be done separately for efficiency)
      const totalDocsSnapshot = await getDocs(docsRef);
      const totalDocuments = totalDocsSnapshot.size;
      setTotalPages(Math.ceil(totalDocuments / pageSize));
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchAllDocs(pageNumber);
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
                  <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                  <td>{doc.displayName}</td>
                  <td>{doc.role}</td>
                  <td>{doc.isDisable ? "Disabled" : "Active"}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleUser(doc.id, doc.uid, false)}
                    >
                      <FaCheckCircle />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleUser(doc.id, doc.uid, true)}
                      className="ms-2 text-white"
                    >
                      <FaBan />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteDocument(doc.id, doc.uid)}
                      className="ms-2"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <Button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminVerifyDocPage;
