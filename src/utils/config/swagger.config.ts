import swaggerJsDoc from "swagger-jsdoc";

export const swaggerDocs = swaggerJsDoc({
  definition: {
    openapi: "1.0.0",
    info: {
      title: "iGP Auth API",
      version: "1.0.0",
      description: "Express ts Auth API Example",
      contact: {
        name: "Jakov Filip Saboliček",
        url: "https://github.com/jfkeci",
        email: "ja.lip132@gmail.com",
      },
    },
    host: "http://localhost:3000",
    basePath: "/api",
  },
  apis: ["../../**/*.model.ts", "../../**/*.routes.ts"],
});
