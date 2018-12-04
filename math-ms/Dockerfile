FROM node:lts-slim
RUN echo "tiancai.pro"
RUN mkdir /home/node/.npm-global ; \
    mkdir -p /home/node/app ; \
    chown -R node:node /home/node/app
USER node
ENV NODE_ENV production
WORKDIR /home/node/app
COPY package.json /home/node/app/package.json
RUN npm install
ENV PORT 50051
EXPOSE 50051

COPY . /home/node/app
RUN npm install grpc --update-binary
CMD ["npm", "start"]