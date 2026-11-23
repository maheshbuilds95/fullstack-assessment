const BASE = "http://localhost:8000";

async function request(path, method = "GET", body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.detail;
    throw new Error(
      Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Request failed",
    );
  }
  return data;
}

export const api = {
  getClaims: (email) =>
    request(
      "/api/claims" +
        (email ? `?claimant_email=${encodeURIComponent(email)}` : ""),
    ),
  createClaim: (claim) => request("/api/claims", "POST", claim),
  respond: (id, response) =>
    request(`/api/claims/${id}/respond`, "POST", { response }),
  assign: (id, officer_name) =>
    request(`/api/claims/${id}/assign`, "POST", { officer_name }),
  requestInfo: (id, message) =>
    request(`/api/claims/${id}/request-info`, "POST", { message }),
  approve: (id, approved_amount, reason) =>
    request(`/api/claims/${id}/approve`, "POST", { approved_amount, reason }),
  reject: (id, reason) =>
    request(`/api/claims/${id}/reject`, "POST", { reason }),
  settle: (id) => request(`/api/claims/${id}/settle`, "POST"),
  getDashboard: () => request("/api/dashboard"),
};
