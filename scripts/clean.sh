#!/usr/bin/env bash
echo "🧹 Full Clean — Appinit OS (Unix)"

pkill -f node || true
pkill -f turbo || true
pkill -f pnpm || true

rm -rf packages/**/dist
rm -rf apps/**/dist

rm -f packages/**/src/*.js
rm -f packages/**/src/**/*.js
rm -f packages/**/src/*.d.ts
rm -f packages/**/src/**/*.d.ts
rm -f packages/**/src/**/*.js.map
rm -f packages/**/src/**/*.tsbuildinfo

rm -rf .turbo node_modules/.pnpm-store
rm -rf node_modules

echo "✔ Clean complete!"
