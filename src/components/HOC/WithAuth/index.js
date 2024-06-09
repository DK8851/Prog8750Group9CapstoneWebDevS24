"use client"

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase_app from '@/utils/firebase/firebase';
import Loading from '@/app/loading';
function withAuth(WrappedComponent) {
    return (props) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const auth = getAuth(firebase_app);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });

            return () => {
                unsubscribe();
            };
        }, [auth]);

        if (loading) {
            return <Loading />; // or some skeleton screen
        }

        return <WrappedComponent user={user} {...props} />;
    };
}

export default withAuth