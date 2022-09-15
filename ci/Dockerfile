ARG build_env
FROM discordbot-env:$build_env

#Install discordbot
WORKDIR /app
COPY *.js package.json .env ./
RUN npm install
CMD ["node", "/app/discordBot.js"]