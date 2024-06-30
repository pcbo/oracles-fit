"use server";
import { supabase } from "@/db";
import { Database } from "@/db/database.types";

type Tables = Database["public"]["Tables"];
export type User = Tables["users"]["Row"];

export async function createUserOrFindUserByWallet(wallet: string) {
  const lowerCaseWallet = wallet.toLowerCase();

  const { data: users } = await supabase
    .from("users")
    .select()
    .eq("wallet", lowerCaseWallet)
    .throwOnError();

  if (users && users.length > 0) {
    return users[0];
  }

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ wallet: lowerCaseWallet });

  if (insertError) {
    throw insertError;
  }

  return newUser;
}

export async function retrieveMeasuresForWallet(wallet: string) {
  const user = await createUserOrFindUserByWallet(wallet);

  if (!user) return null;

  const { data: readings } = await supabase
    .from("readings")
    .select()
    .eq("user_id", user.id)
    .order("date_of_reading", { ascending: false })
    .throwOnError();

  return readings;
}
