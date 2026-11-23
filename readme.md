# Claims Portal

A simple app for insurance claims.

Customers can send in a claim. An officer checks it, can ask questions, and then approves or rejects it.

This is a practice project. Don't use real data.

## What you can do

Customer:

- Send in a claim (motor or property)
- Check your claims using your email
- Answer questions from the officer

Officer:

- See all claims
- Pick up a new claim
- Ask the customer for more info
- Approve (with an amount) or reject, with a reason
- Mark an approved claim as settled (paid)

Dashboard:

- Number of claims in each status
- Number of claims not picked up yet
- Total money that may still need to be paid
- Number of open claims per officer

## Claim status

SUBMITTED → UNDER_REVIEW → APPROVED or REJECTED → SETTLED (only if approved)

If the officer asks a question, the claim goes to AWAITING_INFORMATION. When the customer answers, it goes back to UNDER_REVIEW.

Rules:

- Incident date can't be in the future
- Approved amount can't be more than the estimated amount

## Money still owed (dashboard)

This is:

- the estimated amount of all open claims (SUBMITTED, UNDER_REVIEW, AWAITING_INFORMATION)
- plus the approved amount of claims that are APPROVED but not yet settled

## Built with

- React + Vite (frontend)
- Python + FastAPI (backend)
- SQLAlchemy + PostgreSQL (database)

## How to run

You need Python, Node.js and PostgreSQL.

### 1. Set up the database

Create a file called `.env` in the `backend` folder:

```
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/claims
```

Change the username, password and database name to your own. The table is created when the backend starts.

### 2. Run the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1
# Mac / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs

### 3. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Quick demo

1. Claimant tab: submit a claim with `customer@example.com`
2. Officer tab: enter your name and click "Pick up claim"
3. Type a question and click "Request info"
4. Claimant tab: search your email and answer the question
5. Officer tab: approve or reject with a reason
6. If approved, click "Mark as settled"
7. Check the Dashboard tab

## Not included

- Login (anyone can switch between Claimant and Officer)
- File or photo upload
- Real payments
- Email notifications
- UI/UX enhancements

## AI use

See `AI_WORKING_JOURNAL.md`.
