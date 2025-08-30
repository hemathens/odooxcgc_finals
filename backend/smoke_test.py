from uuid import uuid4
import asyncio
import httpx

# Ensure DB tables exist
from init_db import create_tables
create_tables()

from main import app

async def main():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Health check
        r = await client.get("/health")
        print("GET /health:", r.status_code, r.json())

        # Register a user
        email = f"test-{uuid4().hex[:8]}@example.com"
        password = "S3cretp@ss!"
        register_payload = {
            "name": "Test User",
            "email": email,
            "password": password,
            "role": "student",
        }
        rr = await client.post("/api/auth/register", json=register_payload)
        print("POST /api/auth/register:", rr.status_code)
        print(rr.json())
        if rr.status_code != 200:
            raise SystemExit(1)

        token = rr.json()["access_token"]

        # Login
        login_payload = {
            "email": email,
            "password": password,
            "role": "student",
        }
        rl = await client.post("/api/auth/login", json=login_payload)
        print("POST /api/auth/login:", rl.status_code)
        print(rl.json())
        if rl.status_code != 200:
            raise SystemExit(2)

        auth_headers = {"Authorization": f"Bearer {token}"}

        # Me
        rm = await client.get("/api/auth/me", headers=auth_headers)
        print("GET /api/auth/me:", rm.status_code)
        print(rm.json())
        if rm.status_code != 200:
            raise SystemExit(3)

        print("SMOKE TEST OK")

if __name__ == "__main__":
    asyncio.run(main())
