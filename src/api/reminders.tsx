import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getReminderOverview = async (branchId: string) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.backendToken) {
    throw new Error("User not authenticated");
  }

  const url = `${NEXT_PUBLIC_API_URL}/notifications/reminders/overview/${branchId}`;
  console.log(url, "url");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch reminder overview:", error);
    throw error;
  }
};
