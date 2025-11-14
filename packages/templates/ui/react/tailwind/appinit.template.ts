import { TemplateContext, TemplateSource } from "@appinit/types";
import { readFileUtf8 } from "@appinit/utils";
import fs from "fs-extra";
import path from "node:path";

export default {
  variables(ctx:TemplateContext) {
    // determine extension (tsx or jsx)
    const lang = ctx.answers?.language ?? "typescript";
    return {
      ext: lang === "typescript" ? "tsx" : "jsx"
    };
  },

  async afterWrite(ctx:TemplateContext) {
    const ext = ctx.variables.ext;

    const mainFile = path.join(ctx.targetDir, `src/main.${ext}`);
    let content = await readFileUtf8(mainFile);

    // inject global CSS
    if (!content.includes(`import './index.css'`)) {
      const updated = `import './index.css';\n` + content;
      await fs.writeFile(mainFile, updated, "utf8");
    }

    ctx.log.info("Tailwind CSS added successfully.");
  }
};
