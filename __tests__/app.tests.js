const request = require("supertest");
const app = require("../src/app.js");
const axios = require("../__mocks__/axios");
jest.mock("axios");

axios.get.mockImplementation((url) => {
  // met mock
  if (url.includes("metmuseum")) {
    if (url.includes("/search")) {
       if (url.includes('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')) {
        return Promise.resolve({ data: { total: 0, objectIDs: [] } });
      }
      return Promise.resolve({
        data: { total: 1, objectIDs: [12312] },
      });
    }
  }
  if (url.includes("/objects/")) {
    return Promise.resolve({
      data: {
        objectID: 12312,
        isHighlight: false,
        accessionNumber: "50.130.141cc",
        accessionYear: "1950",
        isPublicDomain: false,
        primaryImage: "",
        primaryImageSmall: "",
        additionalImages: [],
        constituents: [
          {
            constituentID: 162377,
            role: "Artist",
            name: "John Singer Sargent",
            constituentULAN_URL: "http://vocab.getty.edu/page/ulan/500023972",
            constituentWikidata_URL: "https://www.wikidata.org/wiki/Q155626",
            gender: "",
          },
        ],
        department: "The American Wing",
        objectName: "Drawing",
        title: "Tyrolean Man",
        culture: "American",
        period: "",
        dynasty: "",
        reign: "",
        portfolio: "",
        artistRole: "Artist",
        artistPrefix: "",
        artistDisplayName: "John Singer Sargent",
        artistDisplayBio: "American, Florence 1856–1925 London",
        artistSuffix: "",
        artistAlphaSort: "Sargent, John Singer",
        artistNationality: "American",
        artistBeginDate: "1856",
        artistEndDate: "1925",
        artistGender: "",
        artistWikidata_URL: "https://www.wikidata.org/wiki/Q155626",
        artistULAN_URL: "http://vocab.getty.edu/page/ulan/500023972",
        objectDate: "1871",
        objectBeginDate: 1871,
        objectEndDate: 1871,
        medium: "Graphite on off-white wove paper",
        dimensions: "11 3/8 x 15 7/8 in. (28.9 x 40.3 cm)",
        measurements: [
          {
            elementName: "Overall",
            elementDescription: null,
            elementMeasurements: {
              Height: 28.9,
              Width: 40.3226,
            },
          },
        ],
        creditLine: "Gift of Mrs. Francis Ormond, 1950",
        geographyType: "",
        city: "",
        state: "",
        county: "",
        country: "",
        region: "",
        subregion: "",
        locale: "",
        locus: "",
        excavation: "",
        river: "",
        classification: "",
        rightsAndReproduction: "",
        linkResource: "",
        metadataDate: "2025-01-30T04:54:21.21Z",
        repository: "Metropolitan Museum of Art, New York, NY",
        objectURL: "https://www.metmuseum.org/art/collection/search/12312",
        tags: [
          {
            term: "Men",
            AAT_URL: "http://vocab.getty.edu/page/aat/300025928",
            Wikidata_URL: "https://www.wikidata.org/wiki/Q8441",
          },
        ],
        objectWikidata_URL: "",
        isTimelineWork: false,
        GalleryNumber: "",
      },
    });
  }

  //chicago mock
  if (url.includes("artic.edu")) {
    if (url.includes("/search")) {
      if (url.includes('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')) {
        return Promise.resolve({
          data: {
            pagination: { total: 0, limit: 20, offset: 0, total_pages: 0, current_page: 1 },
            data: []
          }
        });
      }
      return Promise.resolve({
        data: {
          pagination: {
            total: 1,
            limit: 20,
            offset: 0,
            total_pages: 1,
            current_page: 1
          },
          data: [
            { id: 1, api_link: 'https://api.artic.edu/api/v1/artworks/12312', title: 'Sewing Box' }
          ]
        }
      });
    }
    if (url.includes("/artworks/")) {
      return Promise.resolve({
        data: {
          data: {
            id: 12312,
            api_model: "artworks",
            api_link: "https://api.artic.edu/api/v1/artworks/12312",
            is_boosted: false,
            title: "Sewing Box",
            alt_titles: null,
            thumbnail: null,
            main_reference_number: "1960.744",
            has_not_been_viewed_much: true,
            boost_rank: null,
            date_start: 1801,
            date_end: 1900,
            date_display: "Qing dynasty (1644-1911), 19th century",
            date_qualifier_title: "",
            date_qualifier_id: null,
            artist_display: "Chinese",
            place_of_origin: "China",
            description: null,
            short_description: null,
            dimensions: "8.3 × 12.4 × 21.3 cm (3 1/4 × 4 7/8 × 8 3/8 in.)",
            dimensions_detail: [
              {
                depth: 21,
                width: 12,
                height: 8,
                diameter: null,
                clarification: null,
              },
            ],
            medium_display: "Ivory",
            inscriptions: null,
            credit_line: "As a Gift from Dr. and Mrs. Selim Walker McArthur",
            catalogue_display: null,
            publication_history: null,
            exhibition_history: null,
            provenance_text: null,
            edition: null,
            publishing_verification_level: "Web Basic",
            internal_department_id: 8,
            fiscal_year: null,
            fiscal_year_deaccession: null,
            is_public_domain: false,
            is_zoomable: false,
            max_zoom_window_size: 843,
            copyright_notice: null,
            has_multimedia_resources: false,
            has_educational_resources: false,
            has_advanced_imaging: false,
            colorfulness: null,
            color: null,
            latitude: null,
            longitude: null,
            latlon: null,
            is_on_view: false,
            on_loan_display: null,
            gallery_title: null,
            gallery_id: null,
            nomisma_id: null,
            artwork_type_title: "Decorative Arts",
            artwork_type_id: 8,
            department_title: "Arts of Asia",
            department_id: "PC-7",
            artist_id: null,
            artist_title: null,
            alt_artist_ids: [],
            artist_ids: [],
            artist_titles: [],
            category_ids: ["PC-7"],
            category_titles: ["Arts of Asia"],
            term_titles: [
              "ivory",
              "decorative object/ornament",
              "asian art",
              "decorative arts",
            ],
            style_id: null,
            style_title: null,
            alt_style_ids: [],
            style_ids: [],
            style_titles: [],
            classification_id: "TM-137",
            classification_title: "ivory",
            alt_classification_ids: ["TM-30", "TM-26", "TM-1678"],
            classification_ids: ["TM-137", "TM-30", "TM-26", "TM-1678"],
            classification_titles: [
              "ivory",
              "decorative object/ornament",
              "asian art",
              "decorative arts",
            ],
            subject_id: null,
            alt_subject_ids: [],
            subject_ids: [],
            subject_titles: [],
            material_id: null,
            alt_material_ids: [],
            material_ids: [],
            material_titles: [],
            technique_id: null,
            alt_technique_ids: [],
            technique_ids: [],
            technique_titles: [],
            theme_titles: [],
            image_id: null,
            alt_image_ids: [],
            document_ids: [],
            sound_ids: [],
            video_ids: [],
            text_ids: [],
            section_ids: [],
            section_titles: [],
            site_ids: [],
            suggest_autocomplete_all: [
              {
                input: ["1960.744"],
                contexts: {
                  groupings: ["accession"],
                },
              },
              {
                input: ["Sewing Box"],
                weight: 1,
                contexts: {
                  groupings: ["title"],
                },
              },
            ],
            source_updated_at: "2023-10-13T16:37:44-05:00",
            updated_at: "2025-04-15T17:50:33-05:00",
            timestamp: "2025-09-27T04:06:29-05:00",
          },
          info: {
            license_text:
              "The `description` field in this response is licensed under a Creative Commons Attribution 4.0 Generic License (CC-By) and the Terms and Conditions of artic.edu. All other data in this response is licensed under a Creative Commons Zero (CC0) 1.0 designation and the Terms and Conditions of artic.edu.",
            license_links: [
              "https://creativecommons.org/publicdomain/zero/1.0/",
              "https://www.artic.edu/terms",
            ],
            version: "1.13",
          },
          config: {
            iiif_url: "https://www.artic.edu/iiif/2",
            website_url: "http://www.artic.edu",
          },
        },
      });
    }
  }
  return Promise.reject(new Error("not found"));
});

describe("GET /search", () => {
  test("200 responds with expected data structure (default)", () => {
    return request(app)
      .get("/search?q=van gogh")
      .expect(200)
      .then(({ body: { artworksData } }) => {
        //check array
        expect(Array.isArray(artworksData)).toBe(true);
        expect(artworksData.length).toEqual(2);
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
          expect(artworksData.length).toEqual(1);
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

  describe("GET /search with on display filter", () => {
    test("200 responds with expected data structure for on display=true", () => {
      return request(app)
        .get("/search?q=monet&on_display=true")
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
        .get("/search?q=monet&on_display=false")
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
        .get("/search?q=monet&on_display=invalidparam")
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
