# Use Node.js 12.18.3 LTS
FROM node:12.18.3

# Environment Variables
ENV PORT 3000
ENV NODE_ENV=production

# Copy Source Code
COPY . /app

# Change Working Directory
WORKDIR /app

# Install Node Dependencies
RUN npm install
RUN npm install --only=dev
RUN npm run build

# Expose PORT
EXPOSE ${PORT}

# Launch Application
CMD ["npm", "start"]