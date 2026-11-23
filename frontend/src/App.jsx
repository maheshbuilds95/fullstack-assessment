import { useState } from "react";
import ClaimantPage from "./pages/ClaimantPage";
import OfficerPage from "./pages/OfficerPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [page, setPage] = useState("claimant");

  return (
    <div>
      <h1>Claims Portal</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setPage("claimant")}>Claimant</button>
        <button onClick={() => setPage("officer")}>Officer</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </div>
      <hr />
      {page === "claimant" && <ClaimantPage />}
      {page === "officer" && <OfficerPage />}
      {page === "dashboard" && <DashboardPage />}
    </div>
  );
}
