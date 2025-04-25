import { supabase } from "../lib/supabase";

export const fetchProfile = async (authId) => {
  if (!authId) throw new Error("No user session found");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error) throw error;

  return { data };
};
