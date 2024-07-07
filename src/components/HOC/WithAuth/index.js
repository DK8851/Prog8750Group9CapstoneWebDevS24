"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "@/utils/firebase/firebase";
import Loading from "@/app/loading";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import db from "@/utils/firebase/firestore";
function withAuth(WrappedComponent) {
  return (props) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRoleInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(firebase_app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          const userDocRef = collection(db, "users");
          const _userDocQuery = query(
            userDocRef,
            where("uid", "==", currentUser.uid),
            limit(1)
          );

          const userDoc = await getDocs(_userDocQuery);
          if (userDoc.docs.length == 1) {
            if (userDoc.docs[0].exists()) {
              let _userData = userDoc.docs[0].data();

              const data = {
                userEditId: userDoc.docs[0].id,
                email: currentUser.email,
                role: _userData.role || "User",
                displayName: _userData.displayName || "",
              };

              setUserRoleInfo(data);
            }
          }
        }

        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }, [auth]);

    if (loading) {
      return <Loading />; // or some skeleton screen
    }

    return <WrappedComponent user={user} userRole={userRole} {...props} />;
  };
}

export default withAuth;
