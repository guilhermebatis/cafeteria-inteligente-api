FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]