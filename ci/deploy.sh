echo "[INFO] Stopping discordbot-production..."
docker container stop discordbot-production
echo "[INFO] Removing out-of-date container..."
docker container rm discordbot-production
echo "[INFO] Starting discordbot with updated image..."
docker run -i -t -d --restart always --name discordbot-production \
-v /discordbot/images:/discordbot/images \
-v /discordbot/commands:/discordbot/commands \
discordbot:production
echo "[DONE] Success."