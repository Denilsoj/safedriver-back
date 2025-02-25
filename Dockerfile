FROM oven/bun

WORKDIR /app

COPY . /app

RUN bun install

RUN bun prisma generate

COPY ./start.sh /start.sh
RUN chmod +x /start.sh