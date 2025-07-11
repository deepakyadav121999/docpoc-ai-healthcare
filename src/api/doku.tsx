import axios from "axios";

const API_URL = process.env.API_URL;

export const dokuGet = async (endpoint: string) => {
  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.get(`${API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const dokuPut = async (endpoint: string, data: any) => {
  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.put(`${API_URL}/${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const dokuPost = async (endpoint: string, data: any) => {
  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.post(`${API_URL}/${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const dokuDelete = async (endpoint: string, data: any) => {
  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.delete(`${API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};
