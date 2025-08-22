import fs from "fs";
import { faker } from "@faker-js/faker";

// Load OpenAPI spec
const spec = JSON.parse(fs.readFileSync("openapi.json", "utf-8"));

// ===================================================================
// Helper: faker generator sesuai rules custom
// ===================================================================
function generateFake(schema, statusCode = 200) {
    if (!schema) return null;

    if (schema.$ref) {
        const ref = schema.$ref.replace("#/components/schemas/", "");
        return generateFake(spec.components.schemas[ref], statusCode);
    }

    switch (schema.type) {
        case "string":
            if (schema.format === "date-time") return faker.date.recent().toISOString();
            if (schema.format === "email") return faker.internet.email();
            return faker.word.sample();

        case "integer":
        case "number":
            return faker.number.int({ min: 1, max: 9999 }).toString();
        case "boolean":
            return faker.datatype.boolean();
        case "array":
            return Array.from({ length: 2 }, () => generateFake(schema.items, statusCode));

        case "object": {
            const result = {};
            for (const [key, value] of Object.entries(schema.properties || {})) {
                if (key === "code") {
                    result.code = parseInt(statusCode);
                } else if (key === "status") {
                    if (statusCode == 200) result.status = "success";
                    else if (statusCode == 201) result.status = "created";
                    else if (statusCode == 400) result.status = "bad request";
                    else if (statusCode == 401) result.status = "unauthorized";
                    else if (statusCode == 404) result.status = "not found";
                    else if (statusCode == 500) result.status = "internal server error";
                    else result.status = "error";
                } else if (key === "id" || key.endsWith("_id")) {
                    result[key] = faker.number.int({ min: 1, max: 9999 }).toString();
                } else if (key === "created_at") {
                    result[key] = faker.date.past().toISOString();
                } else if (key === "updated_at") {
                    result[key] = faker.date.recent().toISOString();
                } else {
                    result[key] = generateFake(value, statusCode);
                }
            }
            return result;
        }

        default:
            return null;
    }
}

// ===================================================================
// Generate Postman Collection
// ===================================================================
function generateCollection() {
    const collection = {
        info: {
            name: (spec.info?.title || "API") + " Mock",
            version: spec.info?.version || "1.0.0",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: [],
    };

    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, details] of Object.entries(methods)) {
            const responses = details.responses || {};
            const mockResponses = [];

            for (const [code, resp] of Object.entries(responses)) {
                const schema = resp.content?.["application/json"]?.schema;
                if (schema) {
                    const fake = generateFake(schema, code);
                    mockResponses.push({
                        name: `${code} Mock`,
                        code: parseInt(code),
                        _postman_previewlanguage: "json",
                        body: JSON.stringify(fake, null, 2),
                        originalRequest: {
                            method: method.toUpperCase(),
                            url: `{{baseUrl}}${path}`,
                            header: [
                                { key: "Content-Type", value: "application/json" }
                            ]
                        },
                    });
                }
            }

            if (mockResponses.length > 0) {
                collection.item.push({
                    name: `${method.toUpperCase()} ${path}`,
                    request: {
                        method: method.toUpperCase(),
                        url: `{{baseUrl}}${path}`,
                    },
                    response: mockResponses,
                });
            }
        }
    }

    return collection;
}

// ===================================================================
// Save to file
// ===================================================================
const result = generateCollection();
fs.writeFileSync("postman-mock-collection.json", JSON.stringify(result, null, 2));
console.log("✅ Postman mock collection generated!");
