from dotenv import load_dotenv
from fastapi import FastAPI
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
import uvicorn
import sqlite3

from lanarky import LangchainRouter

load_dotenv()
app = FastAPI()

# check preimage
@app.post("/preimages")
async def create_preimage(preimage: str):
    # Connect to the database
    conn = sqlite3.connect('preim.db')

    # Create a cursor object to execute SQL commands
    cursor = conn.cursor()

    # Check if the preimage already exists
    cursor.execute("SELECT * FROM preimages WHERE preimage=?", (preimage,))
    existing_preimage = cursor.fetchone()

    if existing_preimage:
        conn.close()
        return {"message": "uhoh"}

    # Insert the new preimage into the database
    cursor.execute("INSERT INTO preimages (preimage) VALUES (?)", (preimage,))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

    return {"message": "Preimage created successfully"}


# Make the query/queries
langchain_router = LangchainRouter(
    langchain_url="/chat",
    langchain_object=ConversationChain(llm=ChatOpenAI(temperature=0), verbose=True),
    streaming_mode=0,
)
app.include_router(langchain_router)

# main
if __name__ == "__main__":
    uvicorn.run("dem1:app", port=5000, log_level="info")
