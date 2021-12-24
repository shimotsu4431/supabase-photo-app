import { Auth } from "@supabase/ui";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const useUser = () => {
  const { user, session } = Auth.useUser();

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

  const signInWithGoogle = () => {
    supabase.auth.signIn({ provider: 'google' })
  }

  const signOut = () => {
    supabase.auth.signOut();
  }

  return {
    user,
    session,
    signInWithGoogle,
    signOut,
  };
}

export { useUser }