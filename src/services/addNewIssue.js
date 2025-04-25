import { supabase } from "../lib/supabase";

export const addIssue = async (newIssue) => {
    const { data, error } = await supabase
      .from('issues') 
      .insert([
        {
          title: newIssue.title,
          description: newIssue.description,
          priority: newIssue.priority,
          status: newIssue.status,
        },
      ]);
  
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
  
    console.log('Inserted data:', data);
  };

  