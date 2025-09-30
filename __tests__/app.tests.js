const request = require("supertest");
const app = require("../src/app.js");

describe("GET /search", () => {
  test("200 responds ", () => {
    return request(app)
      .get("/search?q=flowers")
      .expect(200)
      .then(({ body: { artworksData } }) => {
        expect(artworksData).toHaveProperty("total");
        expect(artworksData).toHaveProperty("objectIDs");
        expect(Array.isArray(artworksData.objectIDs)).toBe(true);
      });
  });
});
