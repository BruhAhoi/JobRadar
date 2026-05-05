import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const routeApiGlobs = [
  path.resolve(process.cwd(), "src/routes/*.ts"),
  path.resolve(process.cwd(), "src/routes/*.js"),
  path.resolve(process.cwd(), "dist/routes/*.js"),
  path.join(__dirname, "../routes/*.ts"),
  path.join(__dirname, "../routes/*.js"),
];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobRadar API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: routeApiGlobs,
};

export const swaggerSpec = swaggerJsdoc(options) as { paths?: Record<string, unknown> };

if (Object.keys(swaggerSpec.paths ?? {}).length === 0) {
  console.warn("[Swagger] No operations found. Checked route globs:", routeApiGlobs);
}
