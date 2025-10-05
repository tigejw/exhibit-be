const request = require("supertest");
const app = require("../src/app.js");
const endpointsJson = require("../src/endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const seedData = require("../db/data/development-data/index.js");

//polly setup
const { Polly } = require("@pollyjs/core");
const NodeHttpAdapter = require("@pollyjs/adapter-node-http");
const FSPersister = require("@pollyjs/persister-fs");
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

//large api calls to met api will cause 503 errors
//build up polly recordings using batch testing with .only
//then run full test suite without .only

beforeEach(() => {
  return seed(seedData);
});

afterAll(() => {
  return db.end();
});

describe.skip("GET / (endpoints json)", () => {
  test("200: Responds with an object with documentation for each endpoint", () => {
    return request(app)
      .get("/")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe.skip("GET /search", () => {
  let polly;

  beforeAll(() => {
    polly = new Polly("search-endpoint", {
      adapters: ["node-http"],
      persister: "fs",
      recordIfMissing: true,
      mode: "replay",
      recordFailedRequests: true,
      persisterOptions: {
        fs: { recordingsDir: `${__dirname}/../__recordings__` },
      },
    });
  });

  afterAll(async () => {
    await polly.stop();
  });

  test("200 responds with expected data structure (default)", () => {
    return request(app)
      .get("/search?q=van gogh&limit=30")
      .expect(200)
      .then(({ body: { artworksData } }) => {
        expect(Array.isArray(artworksData)).toBe(true);
        expect(artworksData.length).toEqual(30);
        const sources = new Set(artworksData.map((a) => a.source));
        expect(sources.size).toBe(2);
        artworksData.forEach((artwork) => {
          console.log(artwork);
          expect(artwork).toHaveProperty("objectID");
          expect(artwork).toHaveProperty("title");
          expect(artwork).toHaveProperty("artistDisplayName");
          expect(artwork).toHaveProperty("medium");
          expect(artwork).toHaveProperty("source");
          expect(artwork).toHaveProperty("isOnView");
          expect(artwork).toHaveProperty("localDepartmentLabel");
          expect(artwork).toHaveProperty("museumDepartment");
          expect(artwork).toHaveProperty("artistDisplayBio");
          expect(artwork).toHaveProperty("artistNationality");
          expect(artwork).toHaveProperty("objectDate");
          expect(artwork).toHaveProperty("dimensions");
          expect(artwork).toHaveProperty("primaryImage");
          expect(artwork).toHaveProperty("primaryImageSmall");
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
          expect(artworksData.length).toEqual(15);
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
          expect(artworksData.length).toEqual(15);
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

  describe("sortBy filter", () => {
    test("200 responds with artworks sorted by title in ascending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=title&order=asc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const titles = artworksData.map((a) => a.title);
          const sorted = [...titles].sort();
          expect(titles).toEqual(sorted);
          const sources = new Set(artworksData.map((a) => a.source));
          expect(sources.size).toBe(2);
        });
    });
    test("200 responds with artworks sorted by title in descending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=title&order=desc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const titles = artworksData.map((a) => a.title);
          const sorted = [...titles].sort().reverse();
          expect(titles).toEqual(sorted);
        });
    });
    test("200 responds with artworks sorted by artistDisplayName in ascending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=artistDisplayName&order=asc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const names = artworksData.map((a) => a.artistDisplayName);
          const sorted = [...names].sort();
          expect(names).toEqual(sorted);
        });
    });
    test("200 responds with artworks sorted by artistDisplayName in descending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=artistDisplayName&order=desc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const names = artworksData.map((a) => a.artistDisplayName);
          const sorted = [...names].sort().reverse();
          expect(names).toEqual(sorted);
        });
    });
    test("200 responds with artworks sorted by medium in ascending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=medium&order=asc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const mediums = artworksData.map((a) => a.medium);
          const sorted = [...mediums].sort();
          expect(mediums).toEqual(sorted);
        });
    });
    test("200 responds with artworks sorted by medium in descending order", () => {
      return request(app)
        .get("/search?q=monet&sortBy=medium&order=desc")
        .expect(200)
        .then(({ body: { artworksData } }) => {
          const mediums = artworksData.map((a) => a.medium);
          const sorted = [...mediums].sort().reverse();
          expect(mediums).toEqual(sorted);
        });
    });
    test("400 responds with error for invalid sortBy value", () => {
      return request(app)
        .get("/search?q=monet&sortBy=invalidSortBy")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("error");
          expect(typeof body.error).toBe("string");
        });
    });
  });

  describe("GET /search pagination", () => {
    test("200 responds with limited number of results per page", () => {
      return request(app)
        .get("/search?q=monet&limit=20&page=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.artworksData.length).toBe(20);
          expect(body).toHaveProperty("totalResults");
          expect(body).toHaveProperty("page", 1);
          expect(body).toHaveProperty("limit", 20);
          expect(body).toHaveProperty("hasNextPage");
        });
    });
    test("200 responds with limited number for only Chicago", () => {
      return request(app)
        .get("/search?q=monet&limit=20&page=1&source=chicago")
        .expect(200)
        .then(({ body }) => {
          expect(body.artworksData.length).toBe(20);
          expect(body).toHaveProperty("totalResults");
          expect(body).toHaveProperty("page", 1);
          expect(body).toHaveProperty("limit", 20);
          expect(body).toHaveProperty("hasNextPage");
        });
    });
    test("should respond with limited number for only met", () => {
      return request(app)
        .get("/search?q=monet&limit=20&page=1&source=met")
        .expect(200)
        .then(({ body }) => {
          expect(body.artworksData.length).toBe(20);
          expect(body).toHaveProperty("totalResults");
          expect(body).toHaveProperty("page", 1);
          expect(body).toHaveProperty("limit", 20);
          expect(body).toHaveProperty("hasNextPage");
        });
    });
    test("200 responds with next page of results", async () => {
      const { body: page1 } = await request(app)
        .get("/search?q=monet&limit=5&page=1")
        .expect(200);
      const { body: page2 } = await request(app)
        .get("/search?q=monet&limit=5&page=2")
        .expect(200);
      expect(page1.artworksData).not.toEqual(page2.artworksData);
    });
    test("200 responds with empty results for non-existent page", () => {
      return request(app)
        .get("/search?q=monet&limit=20&page=99999")
        .expect(200)
        .then(({ body }) => {
          expect(body.artworksData).toHaveLength(0);
          expect(body).toHaveProperty("totalResults", 325);
          expect(body).toHaveProperty("page", 99999);
          expect(body).toHaveProperty("limit", 20);
          expect(body).toHaveProperty("hasNextPage", false);
        });
    });
    test("400 responds with error for invalid page number", () => {
      return request(app)
        .get("/search?q=monet&limit=20&page=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("error");
          expect(typeof body.error).toBe("string");
        });
    });
    test("400 responds with error for invalid page limit", () => {
      return request(app)
        .get("/search?q=monet&limit=-10&page=1")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("error");
          expect(typeof body.error).toBe("string");
        });
    });
  });
});

describe.skip("invalid endpoints", () => {
  test("404 responds with not found for invalid endpoint", () => {
    return request(app)
      .get("/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
      });
  });
});

describe.skip("GET /exhibits", () => {
  test("200 responds with all exhibits", () => {
    return request(app)
      .get("/exhibits")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("exhibits");
        expect(Array.isArray(body.exhibits)).toBe(true);
        expect(body.exhibits).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              exhibit_id: expect.any(Number),
              title: expect.any(String),
              description: expect.any(String),
              thumbnail: expect.any(String),
            }),
          ])
        );
      });
  });
});

describe.skip("POST /exhibits/:exhibit_id/artwork", () => {
  test("201 responds with added artwork", () => {
    return request(app)
      .post("/exhibits/1/artwork")
      .send({
        source: "met",
        objectID: "436524met",
        title: "Sunflowers",
        isPublicDomain: true,
        localDepartmentLabel: "European Art",
        museumDepartment: "European Paintings",
        artistDisplayName: "Vincent van Gogh",
        artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
        artistNationality: "Dutch",
        objectDate: "1887",
        medium: "Oil on canvas",
        dimensions: "17 x 24 in. (43.2 x 61 cm)",
        primaryImage:
          "https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
        primaryImageSmall:
          "https://images.metmuseum.org/CRDImages/ep/web-large/DP229743.jpg",
        isOnView: true,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("artwork");
        expect(body.artwork).toEqual(
          expect.objectContaining({
            exhibit_id: 1,
            artwork_id: expect.any(Number),
            source: "met",
            objectID: "436524met",
            title: "Sunflowers",
            isPublicDomain: true,
            localDepartmentLabel: "European Art",
            museumDepartment: "European Paintings",
            artistDisplayName: "Vincent van Gogh",
            artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
            artistNationality: "Dutch",
            objectDate: "1887",
            medium: "Oil on canvas",
            dimensions: "17 x 24 in. (43.2 x 61 cm)",
            primaryImage:
              "https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
            primaryImageSmall:
              "https://images.metmuseum.org/CRDImages/ep/web-large/DP229743.jpg",
            isOnView: true,
          })
        );
      });
  });
  test("201 add an artwork to exhibit that already exists in artwork db", () => {
    return request(app)
      .post("/exhibits/1/artwork")
      .send({
        source: "met",
        objectID: "436530met",
        title: "Oleanders",
        isPublicDomain: true,
        localDepartmentLabel: "European Art",
        museumDepartment: "European Paintings",
        artistDisplayName: "Vincent van Gogh",
        artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
        artistNationality: "Dutch",
        objectDate: "1888",
        medium: "Oil on canvas",
        dimensions: "23 3/4 x 29 in. (60.3 x 73.7 cm)",
        primaryImage:
          "https://images.metmuseum.org/CRDImages/ep/original/DT1494.jpg",
        primaryImageSmall:
          "https://images.metmuseum.org/CRDImages/ep/web-large/DT1494.jpg",
        isOnView: true,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("artwork");
        expect(body.artwork).toEqual(
          expect.objectContaining({
            exhibit_id: 1,
            artwork_id: expect.any(Number),
            source: "met",
            objectID: "436530met",
            title: "Oleanders",
            isPublicDomain: true,
            localDepartmentLabel: "European Art",
            museumDepartment: "European Paintings",
            artistDisplayName: "Vincent van Gogh",
            artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
            artistNationality: "Dutch",
            objectDate: "1888",
            medium: "Oil on canvas",
            dimensions: "23 3/4 x 29 in. (60.3 x 73.7 cm)",
            primaryImage:
              "https://images.metmuseum.org/CRDImages/ep/original/DT1494.jpg",
            primaryImageSmall:
              "https://images.metmuseum.org/CRDImages/ep/web-large/DT1494.jpg",
            isOnView: true,
          })
        );
      });
  });
  test("409 responds with error if artwork already in exhibit", () => {
    return request(app)
      .post("/exhibits/1/artwork")
      .send({
        source: "met",
        objectID: "437133met",
        title: "Water Lilies",
        isPublicDomain: true,
        localDepartmentLabel: "European Paintings",
        museumDepartment: "European Paintings",
        artistDisplayName: "Claude Monet",
        artistDisplayBio: "French, Paris 1840-1926 Giverny",
        artistNationality: "French",
        objectDate: "1906",
        medium: "Oil on canvas",
        dimensions: "39 3/4 x 79 1/4 in. (101 x 201.3 cm)",
        primaryImage:
          "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
        primaryImageSmall:
          "https://images.metmuseum.org/CRDImages/ep/web-large/DT1567.jpg",
        isOnView: true,
      })
      .expect(409)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(typeof body.error).toBe("string");
      });
  });
  test("400 responds with error for invalid exhibit_id", () => {
    return request(app)
      .post("/exhibits/9999/artwork")
      .send({
        source: "met",
        objectID: "436524met",
        title: "Sunflowers",
        isPublicDomain: true,
        localDepartmentLabel: "European Art",
        museumDepartment: "European Paintings",
        artistDisplayName: "Vincent van Gogh",
        artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
        artistNationality: "Dutch",
        objectDate: "1887",
        medium: "Oil on canvas",
        dimensions: "17 x 24 in. (43.2 x 61 cm)",
        primaryImage:
          "https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
        primaryImageSmall:
          "https://images.metmuseum.org/CRDImages/ep/web-large/DP229743.jpg",
        isOnView: true,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(typeof body.error).toBe("string");
      });
  });
  test("400 responds with error for missing required artwork fields", () => {
    return request(app)
      .post("/exhibits/1/artwork")
      .send({
        source: "met",
        objectID: "436524met",
        //title: "Sunflowers",
        isPublicDomain: true,
        localDepartmentLabel: "European Art",
        museumDepartment: "European Paintings",
        artistDisplayName: "Vincent van Gogh",
        artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
        artistNationality: "Dutch",
        objectDate: "1887",
        medium: "Oil on canvas",
        dimensions: "17 x 24 in. (43.2 x 61 cm)",
        primaryImage:
          "https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
        primaryImageSmall:
          "https://images.metmuseum.org/CRDImages/ep/web-large/DP229743.jpg",
        isOnView: true,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(typeof body.error).toBe("string");
      });
  });
});

describe("GET /exhibits/:exhibit_id", () => {
  test("200 responds with exhibit and related artworks", () => {
    return request(app)
      .get("/exhibits/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("exhibit");
        expect(body.exhibit).toHaveProperty("exhibit_id", 1);
        expect(body.exhibit).toHaveProperty("thumbnail");
        expect(body.exhibit).toHaveProperty("title");
        expect(body.exhibit).toHaveProperty("artworks");
        expect(Array.isArray(body.exhibit.artworks)).toBe(true);
        expect(body.exhibit.artworks.length).toBe(4);
        body.exhibit.artworks.forEach((artwork) => {
          expect(artwork).toEqual(
            expect.objectContaining({
              exhibit_id: 1,
              artwork_id: expect.any(Number),
              source: expect.any(String),
              objectID: expect.any(String),
              title: expect.any(String),
              isPublicDomain: expect.any(Boolean),
              localDepartmentLabel: expect.any(String),
              museumDepartment: expect.any(String),
              artistDisplayName: expect.any(String),
              artistDisplayBio: expect.any(String),
              artistNationality: expect.any(String),
              objectDate: expect.any(String),
              medium: expect.any(String),
              dimensions: expect.any(String),
              primaryImage: expect.any(String),
              primaryImageSmall: expect.any(String),
              isOnView: expect.any(Boolean),
            })
          );
        });
      });
  });
  test('should respond with 404 for non-existent exhibit', () => {
    return request(app)
      .get('/exhibits/314')
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
      });
  });
  test('should respond with 400 for invalid exhibit_id', () => {
    return request(app)
      .get('/exhibits/myfavoutiteexhibitid')
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
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
sort by medium, artistDisplayName, title [done]
  endpoints endpoint! [done]
  pagination [done but with deficit]
  
  
  
also want a create exhibit endpoint
  this will link to a psql data base
  add artwork to exhibit endpoint
  each artwork will need own unique identifier (museum name + code ?)
  a return exhibit endpoint
  remove artwork endpoint 
  think about exhibit object
  title? author?
  then arrays of relevant artworks
  ordering? or random for mvp

  Get/exhibits [done]
  Post/exhibits/:exhibit_id/artwork [done]
  Get/exhibits/:exhibit_id 
  Delete/exhibits/:exhibit_id/artwork/:artwork_id 
  
*/
