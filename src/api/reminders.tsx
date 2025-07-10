import { auth } from "../auth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getReminderOverview = async (branchId: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.token) {
    throw new Error("User not authenticated");
  }

  const url = `${NEXT_PUBLIC_API_URL}/notifications/reminders/overview/${branchId}`;
  console.log(url, "url");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
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
