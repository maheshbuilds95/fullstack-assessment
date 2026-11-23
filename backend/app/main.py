from fastapi import FastAPI

app = FastAPI(title="Claims Platform API")

@app.get("/api/health")
def health():
    return {"status": "ok"}
