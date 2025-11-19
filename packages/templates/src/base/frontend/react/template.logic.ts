export default {
  async transform(ctx:any) {
    if (!ctx.answers.useTailwind) {
      ctx.remove("files/config/tailwind.config.ts__tmpl");
    }
  }
}
