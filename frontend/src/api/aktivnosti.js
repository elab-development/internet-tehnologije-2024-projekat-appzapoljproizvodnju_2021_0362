import http from "./http";


export async function getActivitiesByDate(activity_date) {
  const { data } = await http.get("/activities", { params: { activity_date } });
  return Array.isArray(data) ? data : (data.data ?? data);
}

export async function createActivity({ activity_date, activity_type }) {
  const { data } = await http.post("/activities", { activity_date, activity_type });
  return data;
}

export async function updateActivity(id, partial) {
  const { data } = await http.patch(`/activities/${id}`, partial);
  return data;
}
