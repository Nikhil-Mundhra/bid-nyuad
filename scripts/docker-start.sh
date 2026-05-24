#!/bin/sh
set -eu

npx prisma generate

if [ "${SKIP_DB_PUSH:-0}" != "1" ]; then
  npx prisma db push
fi

if [ "${SEED_DEMO_DATA:-1}" = "1" ]; then
  npm run db:seed
fi

npm run start
