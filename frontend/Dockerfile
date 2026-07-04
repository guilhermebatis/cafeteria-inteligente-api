FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN printenv | grep NEXT_PUBLIC

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]