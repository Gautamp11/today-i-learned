import supabase from "../supabase";

export async function addFact(fact) {
  const { data, error } = await supabase.from("facts").insert([fact]).select();

  if (error) throw new Error(error);

  return data;
}

export async function updateFact(factId, voteType) {
  // First, fetch the current value of the voteType column
  const { data: factData, error: fetchError } = await supabase
    .from("facts")
    .select(voteType)
    .eq("id", factId)
    .single();

  if (fetchError) {
    throw new Error("Failed to fetch current votes: " + fetchError.message);
  }

  // Increment the value of the voteType column
  const updatedVoteCount = factData[voteType] + 1;

  // Now, update the voteType column with the incremented value
  const { data, error: updateError } = await supabase
    .from("facts")
    .update({ [voteType]: updatedVoteCount })
    .eq("id", factId)
    .select();

  if (updateError) {
    throw new Error("Failed to update votes: " + updateError.message);
  }

  return data;
}
