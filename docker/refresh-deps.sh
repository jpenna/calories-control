# Get server dependencies
docker build -f Dockerfile-server-deps -t server-deps ..

# Get front dependencies
docker build -f Dockerfile-web-deps -t web-deps ..
