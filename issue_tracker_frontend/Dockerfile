FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV PORT 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]