export async function before(ctx:any) {
  console.log("Template before hook", ctx.projectName);
}