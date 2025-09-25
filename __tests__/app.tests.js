const request = require("supertest");
const app = require("../src/app.js");

describe("GET /search", () => {
  test("200 responds with expected data structure (default/met)", () => {
    return request(app)
      .get("/search?q=van gogh")
      .expect(200)
      .then(({ body: { artworksData } }) => {
        //check array
        expect(Array.isArray(artworksData)).toBe(true);
        expect(artworksData.length).toEqual(40);
        //artwork object verification could be more thorough
        artworksData.forEach((artwork) => {
          expect(artwork).toHaveProperty("objectID");
          expect(artwork).toHaveProperty("title");
          expect(
            artwork.source === "met" || artwork.source === "chicago"
          ).toBe(true);

        });
      });
  });

  describe("GET /search with source filter", () => {
    test("200 responds with expected data structure for source=chicago", () => {
      return request(app)
        .get("/search?q=monet&source=chicago")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          expect(artworksData.length).toEqual(20);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork.source).toBe("chicago");
          });
        });
    });

    test("200 responds with expected data structure for source=met", () => {
      return request(app)
        .get("/search?q=monet&source=met")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork.source).toBe("met");
          });
        });
    });

    test("400 responds with error for invalid source param", () => {
      return request(app)
        .get("/search?q=monet&source=invalidsource")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("error");
          expect(typeof body.error).toBe("string");
        });
    });
  });

  describe("error handling", () => {
    test("200 responds with empty array if query matches nothing", () => {
      return request(app)
        .get("/search?q=zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(artworksData).toEqual([]);
        });
    });

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

/*
  search endpoint should:
  
  filter by museum - only met / only chicago [done]]
  filter by only on display
  filter by era 
  filter by department/genre(issues with coordinating diff/sameish departments?)
  return uniform artwork objects from both met and chicago


  also want a create exhibit endpoint
  this will link to a psql data base
  add artwork to exhibit endpoint
  each artwork will need own unique identifier (muesum name + code ?)
  a return exhibit endpoint
  remove artwork endpoint
  
  think about exhibit object
  title? author?
  then arrays of relevant artworks
  ordering? or random for mvp
*/
