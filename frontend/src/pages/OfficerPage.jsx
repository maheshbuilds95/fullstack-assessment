import { useEffect, useState } from "react";
import { api } from "../api";

export default function OfficerPage() {
  const [officer, setOfficer] = useState("");
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  async function loadClaims() {
    try {
      setClaims(await api.getClaims());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadClaims();
  }, []); // load once when the page opens

  // Every button: call the API, then refresh the list
  async function runAction(action) {
    try {
      await action();
      loadClaims();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Work queue</h2>
      <input
        placeholder="Your name (officer)"
        value={officer}
        onChange={(e) => setOfficer(e.target.value)}
      />
      <button onClick={loadClaims}>Refresh</button>
      {error && <p className="error">{error}</p>}

      {claims.map((claim) => (
        <OfficerClaim
          key={claim.id}
          claim={claim}
          officer={officer}
          runAction={runAction}
        />
      ))}
    </div>
  );
}

function OfficerClaim({ claim, officer, runAction }) {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="box">
      <b>
        #{claim.id} {claim.claim_type}
      </b>{" "}
      | Status: <b>{claim.status}</b>
      <p>
        {claim.claimant_name} ({claim.claimant_email}), incident on{" "}
        {claim.incident_date}
      </p>
      <p>{claim.description}</p>
      <p>
        Estimated: {claim.estimated_amount} | Officer:{" "}
        {claim.assigned_officer || "none"}
      </p>
      {claim.information_response && (
        <p>Claimant answered: {claim.information_response}</p>
      )}
      {claim.status === "SUBMITTED" && (
        <button
          disabled={!officer}
          onClick={() => runAction(() => api.assign(claim.id, officer))}
        >
          Pick up claim
        </button>
      )}
      {claim.status === "UNDER_REVIEW" && (
        <div>
          <textarea
            placeholder="Question or reason"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="number"
            placeholder="Approved amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={() => runAction(() => api.requestInfo(claim.id, text))}
          >
            Request info
          </button>
          <button
            onClick={() =>
              runAction(() => api.approve(claim.id, Number(amount), text))
            }
          >
            Approve
          </button>
          <button onClick={() => runAction(() => api.reject(claim.id, text))}>
            Reject
          </button>
        </div>
      )}
      {claim.status === "APPROVED" && (
        <button onClick={() => runAction(() => api.settle(claim.id))}>
          Mark as settled
        </button>
      )}
    </div>
  );
}
