# ---- Base Node ----
FROM node:14.10.1-alpine3.10 AS base
# Create app directory
WORKDIR /home/nodeApp

# ---- Dependencies ----
FROM base AS dependencies
# Copy the package.json file
COPY package.json .
# install app dependencies including 'devDependencies'
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /home/nodeApp
COPY . .

# --- Release with Alpine ----
FROM base AS release
# Create app directory
WORKDIR /home/nodeApp
# Copy prod dependencies
COPY --from=dependencies /home/nodeApp/package.json .
# Install app dependencies
RUN npm install

COPY --from=build /home/nodeApp .

# Expose port and cmd
EXPOSE 5000

CMD ["npm", "start"]
