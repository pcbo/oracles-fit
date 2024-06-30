"use server";
import { supabase } from "@/db";
import { Database } from "@/db/database.types";
import { User } from "./users";

type Tables = Database["public"]["Tables"];
export type Reading = Tables["readings"]["Row"];

export async function createReadingForUser(
  user: User,
  reading: { weight: number; date: Date }
) {
  const { data: newReading, error: insertError } = await supabase
    .from("readings")
    .insert({
      weight_kg: reading.weight,
      date_of_reading: reading.date.toISOString(),
      user_id: user.id,
    })
    .select("*");

  if (insertError) {
    throw insertError;
  }

  return newReading;
}
