FROM node:14
WORKDIR /
COPY package.json ./
RUN npm install
COPY . /
EXPOSE 8801
CMD ["npm","start"]