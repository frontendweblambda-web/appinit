export async function after(ctx:any) {
  console.log("Template created:", ctx.targetDir);
}