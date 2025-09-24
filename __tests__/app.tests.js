const request = require("supertest");
const app = require("../src/app.js");

describe("GET /search", () => {
  test("200 responds with expected data structure", () => {
    return request(app)
      .get("/search?q=van gogh")
      .expect(200)
      .then(({ body: { artworksData } }) => {
        //check array
        expect(Array.isArray(artworksData)).toBe(true);
        expect(artworksData.length).toEqual(20);
        //artwork object verification
        artworksData.forEach((artwork) => {
          expect(artwork).toHaveProperty("objectID");
        });
      });
  });

  //met api always returns artworks even with random search

  // test("200 responds with empty array if query matches nothing", () => {
  //   return request(app)
  //     .get("/search?q=zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
  //     .expect(200)
  //     .then(({ body: { artworksData } }) => {
  //       expect(artworksData).toEqual([]);
  //       console.log(artworksData.length);
  //     });
  // });

  test("400 responds with error message if query param is missing", () => {
    return request(app)
      .get("/search")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(typeof body.error).toBe("string");
        expect(body.error).toEqual("Bad request!");
      });
  });
});

describe("invalid endpoints", () => {
  test("404 responds with not found for invalid endpoint", () => {
    return request(app)
      .get("/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
      });
  });
});
