import http from "./http";

export async function getActivitiesByDate(dateStr) {
  const { data } = await http.get(`/activities?date=${dateStr}`);
  return data;
}

export async function createActivity({ activity_date, activity_type }) {
  const { data } = await http.post("/activities", { activity_date, activity_type });
  return data;
}

export async function updateActivity(id, partial) {
  const { data } = await http.patch(`/activities/${id}`, partial);
  return data;
}

export async function deleteActivity(id) {
  await http.delete(`/activities/${id}`);
}