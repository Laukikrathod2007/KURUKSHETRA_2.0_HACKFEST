export const API_BASE = "/api/ecosystem";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  return res;
}

export function postJson(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getJson(path) {
  return request(path).then((res) => res.json());
}
