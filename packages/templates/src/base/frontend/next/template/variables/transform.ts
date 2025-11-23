// template/variables/transform.ts

export function transformVariables(raw, ctx) {
  const vars = { ...raw };

  //
  // Normalize basic strings
  //
  vars.projectName = String(vars.projectName || "my-app").trim();
  vars.projectType = vars.projectType || "frontend";
  vars.framework = vars.framework || "react";
  vars.language = vars.language || "ts";
  vars.ui = vars.ui || "tailwind";

  //
  // Generate project slug
  //
  vars.projectSlug = vars.projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  //
  // Normalize feature flags
  //
  vars.features = vars.features || {};
  vars.features.example = !!vars.features.example;

  //
  // Normalize AI config
  //
  vars.ai = vars.ai || {};
  vars.ai.enabled = !!vars.ai.enabled;
  vars.ai.model = vars.ai.model || "gpt-5";
  vars.ai.autoGenerateComponents = !!vars.ai.autoGenerateComponents;

  //
  // Normalize deploy config
  //
  vars.deploy = vars.deploy || {};
  vars.deploy.provider = vars.deploy.provider || "";
  vars.deploy.region = vars.deploy.region || "";

  //
  // Normalize upgrades
  //
  vars.upgrades = vars.upgrades || {};
  vars.upgrades.enabled = vars.upgrades.enabled !== false;

  //
  // Example: next/router specific variables (optional)
  //
  if (vars.framework === "next") {
    vars.isNext = true;
    vars.usesAppRouter = true; // App Router only templates
  }

  //
  // Example: react specific variables
  //
  if (vars.framework === "react") {
    vars.isReact = true;
  }

  return vars;
}
