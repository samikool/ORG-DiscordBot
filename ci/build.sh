#!/bin/bash
env=${1}
dotenv=${2}

cp ${dotenv} .env

build_args="--build-arg build_env=${env}"
docker build -t discordbot-env:${env} -f ci/Dockerfile.build-env .
docker build ${build_args} -t discordbot:${env} -f ci/Dockerfile .