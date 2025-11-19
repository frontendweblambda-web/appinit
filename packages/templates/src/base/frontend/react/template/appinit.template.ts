export default {
  filters: {
    "**/*.jsx": () => true,
    "**/*.js": () => true,
    "**/*.tsx": () => false,
    "**/*.ts": () => false
  },
  package: {
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    devDependencies: {
      "vite": "^5.0.0",
      "@vitejs/plugin-react": "^5.0.0"
    }
  }
};