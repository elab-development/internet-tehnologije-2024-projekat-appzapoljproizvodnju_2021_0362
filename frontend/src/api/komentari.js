import http from "./http";

export async function getCommentsByDate(date) {
  const { data } = await http.get("/comments", { params: { date } });
  return data.data ?? data;
}

export async function createComment({ date, activity_id, text }) {
  const payload = { text };
  if (date) payload.date = date;
  if (activity_id) payload.activity_id = activity_id;
  const { data } = await http.post("/comments", payload);
  return data;
}

export async function updateComment(id, partial) {
  const { data } = await http.patch(`/comments/${id}`, { text: partial.text || partial });
  return data;
}
