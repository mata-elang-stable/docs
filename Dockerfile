# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG NGINX_VERSION=1.25.2

FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

FROM nginx:${NGINX_VERSION}-alpine as webserver

################################################################################
# Create a stage for building the application.
FROM base as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN yarn run build

FROM webserver as final

# Copy all the files from the build stage into the image.
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
