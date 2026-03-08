from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"], # Puerto de tu Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "95252892507c4c7ca20417bfcead9e8a"

@app.get("/games")
def get_games(page: int = 1):
    url = f"https://api.rawg.io/api/games?key={API_KEY}&page={page}&page_size=20"
    response = requests.get(url)
    return response.json()

@app.get("/games/{game_id}")
def get_game_details(game_id: int):
    url = f"https://api.rawg.io/api/games/{game_id}?key={API_KEY}"
    response = requests.get(url)
    return response.json()

@app.get("/games/genres")
def get_games_by_genre():
    url = f"https://api.rawg.io/api/games?key={API_KEY}&genres=action&page_size=20"
    response = requests.get(url)
    return response.json()

@app.get("/genres")
def get_genres():
    url = f"https://api.rawg.io/api/genres?key={API_KEY}"
    response = requests.get(url)
    return response.json()
