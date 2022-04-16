FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN apk add --no-cache git
RUN yarn

# Bundle app source
COPY ./dist ./dist
COPY ./prisma ./prisma
COPY ./tsconfig.json ./tsconfig.json
ADD ./wait /wait
RUN chmod +x /wait
EXPOSE 4001
CMD /wait && yarn migrate:dev && yarn generate:prisma && yarn start
