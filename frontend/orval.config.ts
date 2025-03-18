module.exports = {
  petstore: {
    output: {
      mode: "tags-split",
      target: "src/petstore.ts",
      schemas: "src/model",
      client: "react-query",
    },
    input: {
      target: "http://localhost:4000/openapi.json",
    },
  },
};
