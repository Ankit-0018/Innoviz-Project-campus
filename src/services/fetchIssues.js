import { supabase } from "../lib/supabase";

export const fetchIssues = async () => {

  let count = {
    critical: 0,
    inProgress: 0,
    resolved: 0
  };

  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false })
    
  if (error) throw error;

  data.forEach((issue) => {
    if (issue.status === "in-progress") count.inProgress++;
    if (issue.priority === "critical") count.critical++;
    if (issue.status === "resolved") count.resolved++;
  });

  return { data, count }; // Return both data and counts
};
