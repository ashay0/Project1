FROM hemendra05/nodejs

RUN mkdir /campGroundApp

WORKDIR /campGroundApp

RUN mkdir ./cloudinary

RUN mkdir ./controller

RUN mkdir ./public

RUN mkdir ./seed

RUN mkdir ./schemaValidator

RUN mkdir ./models

RUN mkdir ./routes

RUN mkdir ./templates

RUN mkdir ./utils

COPY cloudinary/ ./cloudinary

COPY controller/ ./controller

COPY public/ ./public

COPY seed/ ./seed

COPY schemaValidator/ ./schemaValidator

COPY models/ ./models

COPY routes/ ./routes

COPY templates/ ./templates

COPY utils/ ./utils

COPY app.js .

COPY middleware.js .

COPY package.json .

COPY .env .

EXPOSE 3000

RUN npm install

CMD node app.js
