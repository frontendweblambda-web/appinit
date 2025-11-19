## appinit

find packages -name "_.js" -not -path "_/dist/\*" -delete

# reinstall / relink

pnpm install

# build everything with turbo

pnpm -w build

# or if you use turbo directly

pnpm -w build || pnpm -w run build

# dev (watch)

pnpm dev

node -e 'import("@appinit/template-resolver").then(m=>console.log("ok", !!m.default)).catch(e=>{console.error(e);process.exit(1)})'

pnpm -w link --global
appinit --help
