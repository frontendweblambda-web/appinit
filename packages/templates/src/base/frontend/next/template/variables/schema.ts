// template/variables/schema.ts

export const schema = {
  projectName: {
    type: "string",
    minLength: 1,
  },

  projectType: {
    type: "enum",
    values: ["frontend", "backend", "fullstack"],
  },

  framework: {
    type: "enum",
    values: ["react", "next", "vue", "svelte"],
  },

  language: {
    type: "enum",
    values: ["ts", "js"],
  },

  ui: {
    type: "enum",
    values: ["tailwind", "shadcn", "none"],
  },

  features: {
    type: "object",
    properties: {
      example: { type: "boolean" },
    },
  },

  ai: {
    type: "object",
    properties: {
      enabled: { type: "boolean" },
      model: { type: "string" },
      autoGenerateComponents: { type: "boolean" },
    },
  },

  deploy: {
    type: "object",
    properties: {
      provider: { type: "string" },
      region: { type: "string" },
    },
  },

  upgrades: {
    type: "object",
    properties: {
      enabled: { type: "boolean" },
    },
  },
};
