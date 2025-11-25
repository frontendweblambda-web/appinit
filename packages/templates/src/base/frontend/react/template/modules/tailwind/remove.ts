export default async function remove(ctx) {
  ctx.files.delete("tailwind.config.js");
  ctx.dependencies.remove(["tailwindcss"]);
}
