import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseConfig";
import { User as SupabaseUser } from "@supabase/supabase-js";

type AuthContextType = {
    user: SupabaseUser | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

