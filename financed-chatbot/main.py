# Connects with the LLM
from langchain_community.llms import Ollama
# Gets string output
from langchain_core.output_parsers import StrOutputParser
# Adds prompts
from langchain_core.prompts import ChatPromptTemplate
# Creates the document based chain
from langchain.chains.combine_documents import create_stuff_documents_chain
# Creates the retrieval chain
from langchain.chains.retrieval import create_retrieval_chain

# Loads website data
from langchain_community.document_loaders import WebBaseLoader
# Creates embeddings
from langchain_community.embeddings import OllamaEmbeddings

# The documents are indexed into this vector store
from langchain_community.vectorstores import FAISS
# Splits the text into separate paragraphs, then sentences, then words, and then letters
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Can act as a document for the document chain
from langchain_core.documents import Document

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

# Used to make http requests
import requests

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class Bot:
    """
    parameters:
        docs: The text that you want to use as context
        model: The locally installed Ollama model's name that you want to connect to
    """

    def __init__(self, model="llama3"):
        # Creating the retrieval chain
        self.llm = Ollama(model=model)

    def ask(self, query, data):
        return self.llm.invoke(f"{query}"
                               f"Response based on the following data about a stock:"
                               f"{data}")

chatbot = Bot()

stock_backend_url = "http://localhost:8080"
@app.route('/ask/<stock>', methods=['POST'])
@cross_origin()
def ask(stock):
    request_data = request.json
    query = request_data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    stock_response = requests.get(f"{stock_backend_url}/stock/{stock}")
    stock_data = stock_response.text

    return jsonify({"answer": chatbot.ask(query, stock_data)})

