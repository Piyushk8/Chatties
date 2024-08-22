import axios from "axios";

export const server = "http://localhost:3000"


const headers = {
    "Content-Type": `multipart/form-data;`,
    Accept: "multipart/form-data",
  };
  
  export const axiosInstance = axios.create({
    baseURL: "https://localhost:3000/api/v1/chat/message",
    headers,
  });
  