import requests

url = "https://discord.com/api/oauth2/authorize?client_id=671046362783154224&scope=applications.commands"

json = {
    "name": "ping",
    "description": "replies to a ping with a pong",
}

