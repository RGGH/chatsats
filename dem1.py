from dotenv import load_dotenv
from fastapi import FastAPI
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
import uvicorn

from lanarky import LangchainRouter

load_dotenv()
app = FastAPI()

langchain_router = LangchainRouter(
    langchain_url="/chat",
    langchain_object=ConversationChain(llm=ChatOpenAI(temperature=0), verbose=True),
    streaming_mode=0,
)
app.include_router(langchain_router)

if __name__ == "__main__":
    uvicorn.run("dem1:app", port=5000, log_level="info")
