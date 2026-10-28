# One image for all four backend apps (main, external-gateway, mail, whatsapp);
# each compose service picks its entry point. A single build keeps deploys fast
# and guarantees every service runs the same commit.
FROM node:22-alpine AS base
WORKDIR /app
# whatsapp-web.js uses the system chromium below, not puppeteer's own download.
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

FROM base AS build
# .npmrc is left out on purpose: its use-node-version would make pnpm download
# a second Node inside the image.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN for app in main external-gateway mail whatsapp; do \
      node_modules/.bin/nest build "$app" || exit 1; \
    done

FROM base AS runtime
RUN apk add --no-cache dumb-init chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV NODE_ENV=production
# Full node_modules (dev included): `nest build` leaves the @libs/* aliases
# unresolved, so every app is started through tsconfig-paths, a devDependency.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json tsconfig.json tsconfig.base.json ./
COPY deploy/start.sh ./start.sh
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh \
    && mkdir -p /app/session && chown -R node:node /app/session
USER node
ENTRYPOINT ["dumb-init", "--", "./start.sh"]
CMD ["main"]
