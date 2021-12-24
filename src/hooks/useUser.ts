import { Auth } from "@supabase/ui";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Profile = {
  avatarurl: string | null
  fullname: string | null
  id: string | null
  nickname: string | null
}

const useUser = () => {
  const { user, session } = Auth.useUser();
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const setupProfile = async () => {
      if (session?.user?.id) {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(user);
      }
    };
    setupProfile();
  }, [session]);

  const signInWithGoogle = () => {
    supabase.auth.signIn({ provider: 'google' })
  }

  const signOut = () => {
    supabase.auth.signOut();
    setProfile(null)
  }

  return {
    user,
    session,
    profile,
    signInWithGoogle,
    signOut,
  };
}

export { useUser }