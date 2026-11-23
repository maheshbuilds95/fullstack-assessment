import { useEffect, useState } from "react";
import { api } from "../api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        Unassigned claims: <b>{data.unassigned}</b>
      </p>
      <p>
        Outstanding liability: <b>{data.outstanding_liability.toFixed(2)}</b>
      </p>

      <h3>Claims by status</h3>
      {Object.entries(data.status_counts).map(([status, count]) => (
        <p key={status}>
          {status}: {count}
        </p>
      ))}

      <h3>Officer workload</h3>
      {data.workload.length === 0 && <p>No claims assigned yet.</p>}
      {data.workload.map((w) => (
        <p key={w.officer}>
          {w.officer}: {w.open_claims} active claims
        </p>
      ))}
    </div>
  );
}
