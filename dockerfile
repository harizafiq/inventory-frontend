FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve static frontend with adapter-node or adapter-static
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
