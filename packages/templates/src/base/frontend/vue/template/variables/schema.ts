export const schema = {
  projectName: { type: "string", required: true },
  ui: { type: "string", enum: ["tailwind", "mui", "none"] },
  language: { type: "string", enum: ["javascript", "typescript"] }
};
