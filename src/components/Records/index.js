"use client";

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  increment,
  getDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebase_app from "@/utils/firebase/firebase";
import RecordCard from "./RecordCard";
import { Row } from "react-bootstrap";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const RecordList = ({ deleteAccess }) => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Real-time listener for emergency records
    const unsubscribe = onSnapshot(
      collection(db, "emergency"),
      async (snapshot) => {
        const fetchedRecords = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(fetchedRecords);

        // Fetch user data for each unique uid
        const uniqueUids = [
          ...new Set(fetchedRecords.map((record) => record.uid)),
        ];
        const userDocs = await Promise.all(
          uniqueUids.map((uid) => getDoc(doc(db, "users", uid)))
        );
        const fetchedUsers = {};
        userDocs.forEach((userDoc) => {
          if (userDoc.exists()) {
            fetchedUsers[userDoc.id] = userDoc.data();
          }
        });
        setUsers(fetchedUsers);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (recordId) => {
    try {
      await deleteDoc(doc(db, "emergency", recordId));
      console.log(`Record with id ${recordId} deleted`);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleUpvote = async (recordId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    const recordRef = doc(db, "emergency", recordId);

    try {
      const recordSnap = await getDoc(recordRef);
      if (recordSnap.exists()) {
        const recordData = recordSnap.data();
        const upvoted = recordData.upvotes?.[user.uid];

        if (upvoted) {
          // Remove upvote
          await updateDoc(recordRef, {
            [`upvotes.${user.uid}`]: deleteField(),
            upvoteCount: increment(-1),
          });
        } else {
          // Add upvote
          await updateDoc(recordRef, {
            [`upvotes.${user.uid}`]: true,
            upvoteCount: increment(1),
          });
        }
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  return (
    <div className="container">
      <Row>
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            showDeleteButton={deleteAccess}
            onDelete={() => handleDelete(record.id)}
            onUpvote={handleUpvote}
            user={users[record.uid]}
          />
        ))}
      </Row>
    </div>
  );
};

export default RecordList;
