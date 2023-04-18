FROM node:alpine
WORKDIR /app

# 設定時區為台北時區
ENV TZ Asia/Taipei

# 更新系統時區
RUN apk --no-cache add tzdata \
  && cp /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone

COPY ["package*.json", "./"]
RUN npm install

COPY . .
EXPOSE 8000

CMD [ "node", "app.js"]


