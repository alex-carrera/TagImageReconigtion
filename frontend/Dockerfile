FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NG_BUILD_CONFIGURATION=production
ARG NG_BUILD_FLAGS=""

RUN npm run build -- --configuration ${NG_BUILD_CONFIGURATION} ${NG_BUILD_FLAGS}

FROM nginx:stable-alpine AS production

COPY --from=build /app/dist/FrontEnd/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
