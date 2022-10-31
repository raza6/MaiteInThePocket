# Deploy Maite in the Pocket

## Requirements

- Docker and Docker-compose

It is advised to use lazydocker as well.

## Architecture

The project is split in two parts: **server** and **app**.

The entirety of it is served through *nginx*, either as a reverse proxy or a simple static server.

### Server

The server runs with a *node* and a *mongo* server. The requests are forwarded to that server by *nginx* (reverse proxy). Their paths start with `/mp`. Those containers communicate through their own *docker* sub-network.

### App

The app is simply served as static files. It just needs to be built by the dedicated container to be up-to-date. All app requests paths start with `/app`.

```

                                     ┌───────────┐    ┌d──────────┐
                     │         ┌─────┤app build  │◄───┤node app   │
                     │         │     └───────────┘    └───────────┘
                     │         │
                     │  ┌d─────┴─────┐
                     │  │            │
                     │  │ nginx /app │
  External world ◄───┼──┤            │
                     │  │            │
                     │  │ nginx /mp  │
                     │  │            │
                     │  └──────┬─────┘
                     │         │
                     │         │
                     │         │     ┌d───────────┐   ┌d──────┐
                     │         └─────┤node server ├───┤mongo  │
                     │               └────────────┘   └───────┘

```

## Steps

- `git clone` the project in `maite` directory
- In the parent directory, create a `docker-compose.yaml` file based on the configuration available in the appendix. Make sure the configuration is correct.
- Repeat for the `default.conf` file.
- Start containers one after the other in the following order : mongo, node server, node app, nginx. `docker-compose up -d container_name`

## Appendix - File configuration

### docker-compose.yaml

```yaml
version: "3"

services:
  nginx:
    image: nginx:alpine
    restart: on-failure
    ports:
     - '80:80'
    volumes:
     - './maite/src/app/build/:/usr/src/maite'
     - './default.conf:/etc/nginx/conf.d/default.conf:ro'
    networks:
      - maite
  mongo:
    image: mongo:4.0
    container_name: mongodb
    volumes:
      - './maite/src/docker/mongo/data:/data/db'
      - './maite/src/docker/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro'
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=******
      - MONGO_INITDB_DATABASE=MaiteInThePocket
    networks:
      maite:
        ipv4_address: 10.5.0.5
  maite_server:
    image: node:18.6
    container_name: node_maite_server
    volumes:
      - './maite/src/server:/src'
    working_dir: /src
    command: >
      sh -c 'npm ci && npm run start'
    ports:
      - '3005:3005'
    depends_on:
      - mongo
    networks:
      maite:
        ipv4_address: 10.5.0.6
  maite_app:
    image: node:18.6
    container_name: node_maite_app
    volumes:
      - './maite/src/app:/src'
    working_dir: /src
    command: >
      sh -c 'npm ci && rm -rf build/ temp/ && mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache && npm run build && mkdir temp && mv build/* temp/ && mkdir build/app && mv temp/* build/app/'

networks:
  maite:
    driver: bridge
    ipam:
      config:
        - subnet: 10.5.0.0/16
          gateway: 10.5.0.1
```

### default.conf

```nginx
server {
    listen 80;
    server_name ******;

    location /app {
        root   /usr/src/maite;
        index  /app/index.html;
        try_files $uri $uri/ /app/index.html =404;
    }

    location /mp/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://10.5.0.6:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 4M;
    }
}
```
