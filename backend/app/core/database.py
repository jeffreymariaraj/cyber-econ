import os
from motor.motor_asyncio import AsyncIOMotorClient

# Default to local mongo if not env var
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "cyberecon"

class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        self.client = AsyncIOMotorClient(MONGODB_URL)
        print(f"Connected to MongoDB at {MONGODB_URL}")

    def close(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")

    def get_db(self):
        return self.client[DATABASE_NAME]

db = Database()

async def get_database():
    return db.get_db()
