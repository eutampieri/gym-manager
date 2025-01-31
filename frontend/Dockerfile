FROM node:22-alpine AS builder
COPY . /build
WORKDIR /build/frontend
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=builder /build/frontend/dist /usr/share/nginx/html
EXPOSE 80
LABEL "traefik.http.routers.frontend.rule"="PathPrefix(`/`)"
