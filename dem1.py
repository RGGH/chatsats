from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Response, Request
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
import uvicorn
import sqlite3
import secrets

from lanarky import LangchainRouter

load_dotenv()
app = FastAPI()

# Store the secrets in memory
secrets_set = set()


def generate_secret():
    # Generate a random secret using the secrets module
    return secrets.token_hex(16)


# check preimage
@app.post("/preimages")
async def create_preimage(preimage: str, response: Response):
    # Generate a single-use secret/token
    secret = generate_secret()
    # Set the secret as a cookie
    response.set_cookie(key="secret", value=secret, max_age=3600)

    # Add the secret to the set of secrets in memory
    secrets_set.add(secret)

    # Connect to the database
    conn = sqlite3.connect("preim.db")

    # Create a cursor object to execute SQL commands
    cursor = conn.cursor()

    # Create the preimages table if not yet exisits
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS preimages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            preimage TEXT NOT NULL
        )
    """
    )

    # Check if the preimage already exists
    cursor.execute("SELECT * FROM preimages WHERE preimage=?", (preimage,))
    existing_preimage = cursor.fetchone()

    if existing_preimage:
        conn.close()
        raise HTTPException(status_code=409, detail="Preimage already exists")

    # Count the total number of records in the table
    cursor.execute("SELECT COUNT(*) FROM preimages")
    total_records = cursor.fetchone()[0]

    if total_records >= 999999:
        # Delete the oldest record
        cursor.execute("DELETE FROM preimages WHERE id = (SELECT MIN(id) FROM preimages)")

    # Insert the new preimage into the database
    cursor.execute("INSERT INTO preimages (preimage) VALUES (?)", (preimage,))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

    # preimage is good and not already in DB - return ok!
    return


# Make the query/queries
langchain_router = LangchainRouter(
    langchain_url="/chat",
    langchain_object=ConversationChain(llm=ChatOpenAI(temperature=0), verbose=True),
    streaming_mode=0,
)
app.include_router(langchain_router)


# main
if __name__ == "__main__":
    uvicorn.run("dem1:app", port=5000, log_level="debug")
