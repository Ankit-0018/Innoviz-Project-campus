import { supabase } from "../lib/supabase";

export const fetchLost = async () => {

 

  const { data, error } = await supabase
    .from("lost_found")
    .select("*")

  if (error) throw error;


  return { data }; 
};
