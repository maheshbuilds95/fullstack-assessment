import { useState } from "react";
import { api } from "../api";

const emptyForm = {
  claimant_name: "",
  claimant_email: "",
  claim_type: "MOTOR",
  description: "",
  incident_date: "",
  estimated_amount: "",
};

export default function ClaimantPage() {
  const [form, setForm] = useState(emptyForm);
  const [email, setEmail] = useState("");
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function loadClaims(emailToLoad) {
    try {
      setClaims(await api.getClaims(emailToLoad));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitClaim(e) {
    e.preventDefault();
    try {
      await api.createClaim({
        ...form,
        estimated_amount: Number(form.estimated_amount),
      });
      setEmail(form.claimant_email);
      loadClaims(form.claimant_email);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendAnswer(claimId, answer) {
    try {
      await api.respond(claimId, answer);
      loadClaims(email);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}

      <h2>Report an incident</h2>
      <form onSubmit={submitClaim}>
        <input
          name="claimant_name"
          placeholder="Full name"
          value={form.claimant_name}
          onChange={handleChange}
          required
        />
        <input
          name="claimant_email"
          type="email"
          placeholder="Email"
          value={form.claimant_email}
          onChange={handleChange}
          required
        />
        <select
          name="claim_type"
          value={form.claim_type}
          onChange={handleChange}
        >
          <option value="MOTOR">Motor</option>
          <option value="PROPERTY">Property</option>
        </select>
        <input
          name="incident_date"
          type="date"
          value={form.incident_date}
          onChange={handleChange}
          required
        />
        <input
          name="estimated_amount"
          type="number"
          step="0.01"
          placeholder="Estimated amount"
          value={form.estimated_amount}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="What happened?"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit claim</button>
      </form>

      <h2>Track my claims</h2>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => loadClaims(email)}>Search</button>

      {claims.map((claim) => (
        <div className="box" key={claim.id}>
          <b>
            #{claim.id} {claim.claim_type}
          </b>{" "}
          | Status: <b>{claim.status}</b>
          <p>{claim.description}</p>
          <p>Estimated: {claim.estimated_amount}</p>
          {claim.approved_amount && <p>Approved: {claim.approved_amount}</p>}
          {claim.decision_reason && (
            <p>Decision note: {claim.decision_reason}</p>
          )}
          {claim.status === "AWAITING_INFORMATION" && (
            <AnswerBox
              question={claim.information_request}
              onSend={(answer) => sendAnswer(claim.id, answer)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function AnswerBox({ question, onSend }) {
  const [answer, setAnswer] = useState("");
  return (
    <div>
      <p>
        <b>Officer asks:</b> {question}
      </p>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={() => onSend(answer)}>Send answer</button>
    </div>
  );
}
