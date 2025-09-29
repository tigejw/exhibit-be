/** @jest-environment setup-polly-jest/jest-environment-node */
const { Polly } = require("@pollyjs/core");
const NodeHttpAdapter = require("@pollyjs/adapter-node-http");
const FSPersister = require("@pollyjs/persister-fs");
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);
const path = require("path");
const request = require("supertest");
const app = require("../src/app.js");

describe("GET /search", () => {
  let polly;

  beforeAll(() => {
    polly = new Polly("search-endpoint", {
      adapters: ["node-http"],
      persister: "fs",
      recordIfMissing: true,
      recordFailedRequests: true,
      persisterOptions: {
        fs: { recordingsDir: path.resolve(__dirname, "../__recordings__") },
      },
    });
  });

  afterAll(async () => {
    await polly.stop();
  });

  test("200 responds with expected data structure (default)", () => {
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
          expect(artwork.source === "met" || artwork.source === "chicago").toBe(
            true
          );
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
          expect(artworksData.length).toEqual(20);
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

  describe("GET /search with on display filter", () => {
    test("200 responds with expected data structure for on display=true", () => {
      return request(app)
        .get("/search?q=monet&onDisplay=true")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork).toHaveProperty("isOnView");
            expect(artwork.isOnView).toBe(true);
          });
        });
    });

    test("200 responds with expected data structure for on display=false", () => {
      return request(app)
        .get("/search?q=monet&onDisplay=false")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork).toHaveProperty("isOnView");
            expect(artwork.isOnView).toBe(false);
          });
        });
    });

    test("400 responds with error for invalid on_display param", () => {
      return request(app)
        .get("/search?q=monet&onDisplay=invalidparam")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("error");
          expect(typeof body.error).toBe("string");
        });
    });
  });

  describe("GET /search with departments filter", () => {
    test("200 responds with only artworks from the specified department", () => {
      return request(app)
        .get("/search?q=monet&department=European Art")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork.localDepartmentLabel).toBe("European Art");
          });
        });
    });
    test("200 responds with only artworks from the specified department (met)", () => {
      return request(app)
        .get("/search?q=monet&source=met&department=European Art")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork.source).toBe("met");
            expect(artwork.localDepartmentLabel).toBe("European Art");
          });
        });
    });

    test("200 responds with only artworks from the specified department (chicago)", () => {
      return request(app)
        .get("/search?q=monet&source=chicago&department=European Art")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          expect(Array.isArray(artworksData)).toBe(true);
          artworksData.forEach((artwork) => {
            expect(artwork).toHaveProperty("objectID");
            expect(artwork).toHaveProperty("title");
            expect(artwork.source).toBe("chicago");
            expect(artwork.localDepartmentLabel).toBe("European Art");
          });
        });
    });

    test("400 responds with error for invalid department", async () => {
      return request(app)
        .get("/search?q=monet&department=NotARealDepartment")
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
          expect(body.error).toEqual("Bad request: query");
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
  filter by only on display [done]
  filter by era [too complex for mvp with current apis]
  filter by department/genre(issues with coordinating diff/sameish departments?) [done more testing though]
  return uniform artwork objects from both met and chicago [done]

  endpoints endpoint!
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
