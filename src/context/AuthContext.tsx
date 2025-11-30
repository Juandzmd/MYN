import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: any | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfileWithRetry(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfileWithRetry(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfileWithRetry = async (userId: string, retries = 3, delay = 500) => {
        for (let i = 0; i < retries; i++) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching profile:', error);
                } else if (data) {
                    setProfile(data);
                    setLoading(false);
                    return; // Success
                } else {
                    console.warn(`Profile not found for user: ${userId}. Attempt ${i + 1} of ${retries}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            // Wait before retrying
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
        }
        
        // If we ran out of retries
        console.error('Failed to load profile after retries');
        // IMPORTANT: Do NOT set a "fake" profile if real one failed to load.
        // Let the UI show a loading state or handle null profile gracefully.
        // setProfile({ id: userId, role: 'user' }); // Removed fallback causing stale data issues
        setLoading(false);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfileWithRetry(user.id);
        }
    };

    const value = {
        session,
        user,
        profile,
        isAdmin: profile?.role === 'admin',
        loading,
        signOut,
        refreshProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
