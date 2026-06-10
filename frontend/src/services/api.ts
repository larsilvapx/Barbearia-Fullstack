import axios from "axios";

export const api = axios.create({
  baseURL: "https://barbearia-fullstack.onrender.com/api/",
});