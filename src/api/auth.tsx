// require("dotenv").config();
import axios from "axios";

const domain = process.env.DEVELOPMENT;
const endPoint = process.env.API_URL;
if (!domain) {
  console.error(`Environment variable for state ${domain} is not defined.`);
}

if (!endPoint) {
  console.error("Environment variable API_URL is not defined.");
}

const baseUrl = `${domain}${endPoint}`.toString();
const defaultAccessType =
  '{"setAppointments":false,"messagePatient":true,"editDoctor":true}';
const defautUserType = "SUPER_ADMIN";

export function AuthData() {
  return { defaultAccessType, defautUserType, baseUrl };
}

export async function UserSignUp(
  body: {
    phone?: string;
    email?: string;
    password: string;
    clinicSize: string;
  },
  authData: any,
) {
  const url = `${authData.baseUrl}/user`;
  console.log(`Base URL new: ${url}`);
  try {
    const { phone, email, clinicSize } = body;
    const userName = phone ? phone : email;

    if (!authData.baseUrl) {
      throw new Error("Base URL is undefined.");
    }
    const request = await axios({
      method: "post",
      url,
      headers: {},
      data: {
        ...body,
        name: userName,
        userName,
        userType: authData.defautUserType,
        accessType: authData.defaultAccessType,
        josn: JSON.stringify({ clinicSize }),
      },
    });
    console.log(request);
    return request.data;
  } catch (error) {
    console.error("Error making signup request:", error);
    return error;
  }
}

export async function UserSignIn(
  body: {
    phone?: string;
    email?: string;
    password: string;
  },
  authData: any,
) {
  const url = `${authData.baseUrl}/auth/login`;
  console.log(`Base URL new: ${url}`, body);
  try {
    const { phone, email, password } = body;
    const userName = phone ? phone : email;

    if (!authData.baseUrl) {
      throw new Error("Base URL is undefined.");
    }
    const request = await axios({
      method: "post",
      url,
      headers: {},
      data: {
        username: userName,
        password,
      },
    });
    console.log(request);
    return request.data;
  } catch (error) {
    console.error("Error making signup request:", error);
    return error;
  }
}

export async function SignOut() {
  // localStorage.removeItem("profile");
  // localStorage.removeItem("docPocAuth_token");
  // localStorage.removeItem("userProfile");

  console.log("SignOut called");
  localStorage.removeItem("docPocAuth_token");
  console.log("Token removed");
  localStorage.removeItem("userProfile");
  console.log("userProfile removed");
  localStorage.removeItem("profile");
  console.log("Profile removed");

  window.location.reload();
}
