import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export async function getProblems() {
  const { data } = await api.get("/problems");
  return data;
}

export async function getProblem(id) {
  const { data } = await api.get(`/problems/${id}`);
  return data;
}

export async function submitSolution(id, code) {
  const { data } = await api.post(`/problems/${id}/submit`, { code });
  return data;
}
