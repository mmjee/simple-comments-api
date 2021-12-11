FROM node:lts

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY sca ./sca

RUN yarn install
RUN npx greenlock init --config-dir greenlock.d --maintainer-email your@email.com
RUN npx greenlock add --subject your.domain.com --altnames your.domain.com

EXPOSE 80 443

ENV NODE_PATH=.
ENV NODE_ENV=production
ENV NODE_OPTIONS="--unhandled-rejections=warn --dns-result-order=verbatim"

CMD ["node", "auto.js"]
