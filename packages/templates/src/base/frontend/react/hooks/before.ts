export function before(ctx:any) {
 ctx.log.info("▶ before hook running…");

  // EXAMPLES:
  // Remove file from VFS
  // ctx.files.delete("src/secret.txt");

  // Modify content
  // const content = ctx.files.get("src/index.ts");
  // ctx.files.set("src/index.ts", content.replace("foo","bar"));

  // Add dynamic files
  // ctx.files.set("README.md", `# ${ctx.projectName}`);
}
