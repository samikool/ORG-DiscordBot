#!/bin/bash
echo "Following is a build script:"
env=${1}
dotenv=${2}

cd ..

cp ${dotenv} .env

build_args="--build-arg build_env=${env}"
echo "${build_args}"
docker build ${build_args} -t discordbot-env:${env} -f ci/Dockerfile.build-env .
docker build ${build_args} -t discordbot:${env} -f ci/Dockerfile .

echo "Following should be a test script:"
sleep 1