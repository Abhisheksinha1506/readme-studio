# Pinned to a supported LTS line so every build uses the same Node major
FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

# Copy the manifest and the lockfile the project actually maintains
COPY package.json yarn.lock ./

# Install exactly the versions recorded in yarn.lock
RUN yarn install --frozen-lockfile

# Bundle app source (see .dockerignore for what is left out)
COPY . .

# Build the TypeScript files
RUN yarn build

# Expose port 8080
EXPOSE 8080

# Drop root: the app only reads its files and listens on an unprivileged port
USER node

# Start the app
CMD npm run start
