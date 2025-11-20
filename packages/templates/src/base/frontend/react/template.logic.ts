export default {
  async transform(ctx) {
    if (!ctx.answers.useTailwind) {
      ctx.files.delete("src/styles/tailwind.css");
    }
  }
};
