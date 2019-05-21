# Get server dependencies
docker build -f Dockerfile-server-deps -t cal-server-deps ..

# Get front dependencies
docker build -f Dockerfile-web-deps -t cal-web-deps ..
