import axios from "axios";
import "dotenv"


export const server = import.meta.env.VITE_SERVER

const headers = {
    "Content-Type": `multipart/form-data;`,
    Accept: "multipart/form-data",
  };
  
  export const axiosInstance = axios.create({
    baseURL: "https://localhost:3000/api/v1/chat/message",
    headers,
  });
  