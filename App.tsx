
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, getDocente } from './services/firebaseService';
import type { Docente } from './types';

import AuthView from './components/Auth';
import CoursesView from './components/Courses';
import MyCoursesView from './components/MyCourses';
import Navbar from './components/Navbar';
import Spinner from './components/common/Spinner';

type View = 'courses' | 'my-courses';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [docenteProfile, setDocenteProfile] = useState<Docente | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>('courses');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const profile = await getDocente(user.uid);
                    setDocenteProfile(profile);
                } catch (error) {
                    console.error("Error fetching docente profile:", error);
                    setDocenteProfile(null);
                }
            } else {
                setCurrentUser(null);
                setDocenteProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await auth.signOut();
            setView('courses');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {currentUser && docenteProfile ? (
                <>
                    <Navbar 
                        docenteName={docenteProfile.nombreCompleto}
                        onLogout={handleLogout}
                        currentView={view}
                        setView={setView}
                    />
                    <main className="container mx-auto p-4 md:p-8">
                        {view === 'courses' && <CoursesView docenteProfile={docenteProfile} />}
                        {view === 'my-courses' && <MyCoursesView docenteProfile={docenteProfile} />}
                    </main>
                </>
            ) : (
                <AuthView />
            )}
        </div>
    );
};

export default App;
