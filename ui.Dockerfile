# build environment
FROM node:22-alpine3.19 as build
WORKDIR /app
COPY ./frontend .
RUN yarn
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
#COPY --from=build /app/dist/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]