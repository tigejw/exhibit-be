module.exports = {
  exhibitData: [
    {
      title: "example exhibit",
      description: "a collection of my favourites",
    },
    // {
    //   title: "my favourite cat photos",
    //   description: "meowmeow!",
    // },
    // {
    //   title: "my favourite dog photos",
    //   description: "woofwoof!",
    // },
  ],
  artworkData: [
    {
      source: "met",
      objectID: "438008met",
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
    },
    {
      source: "chicago",
      objectID: "150802chicago",
      title: "The Carrot Puller",
      isPublicDomain: true,
      localDepartmentLabel: "European Paintings",
      museumDepartment: "Prints and Drawings",
      artistDisplayName: "Vincent van Gogh",
      artistDisplayBio: "Vincent van Gogh\nDutch, 1853-1890",
      artistNationality: "Netherlands",
      objectDate: "1885",
      medium: "Black chalk, with stumping and erasing, on cream wove paper",
      dimensions: "52.5 × 42.2 cm (20 11/16 × 16 5/8 in.)",
      primaryImage:
        "https://www.artic.edu/iiif/2/f9bf9113-e9e1-68ad-19f4-1e7aae2a9946/full/843,/0/default.jpg",
      primaryImageSmall:
        "https://www.artic.edu/iiif/2/f9bf9113-e9e1-68ad-19f4-1e7aae2a9946/full/200,/0/default.jpg",
      isOnView: false,
    },
    {
      source: "chicago",
      objectID: "52733chicago",
      title: "Weeping Tree",
      isPublicDomain: true,
      localDepartmentLabel: "European Paintings",
      museumDepartment: "Prints and Drawings",
      artistDisplayName: "Vincent van Gogh",
      artistDisplayBio: "Vincent van Gogh\nDutch, 1853-1890",
      artistNationality: "Netherlands",
      objectDate: "1889",
      medium:
        "Reed pen and black-brown ink, with black chalk on off-white wove paper",
      dimensions: "49.3 × 61.3 cm (19 7/16 × 24 3/16 in.)",
      primaryImage:
        "https://www.artic.edu/iiif/2/34f09257-4c7f-3421-7396-e9dba321258a/full/843,/0/default.jpg",
      primaryImageSmall:
        "https://www.artic.edu/iiif/2/34f09257-4c7f-3421-7396-e9dba321258a/full/200,/0/default.jpg",
      isOnView: false,
    },
    {
      source: "met",
      objectID: "437998met",
      title: "Olive Trees",
      isPublicDomain: true,
      localDepartmentLabel: "European Paintings",
      museumDepartment: "European Paintings",
      artistDisplayName: "Vincent van Gogh",
      artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
      artistNationality: "Dutch",
      objectDate: "1889",
      medium: "Oil on canvas",
      dimensions: "28 5/8 x 36 1/4 in. (72.7 x 92.1 cm)",
      primaryImage:
        "https://images.metmuseum.org/CRDImages/ep/original/DT1946.jpg",
      primaryImageSmall:
        "https://images.metmuseum.org/CRDImages/ep/web-large/DT1946.jpg",
      isOnView: true,
    },
    {
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
    },
  ],
  //refactor to use ids not titles
  exhibitArtworkData: [
    {
      exhibit_title: "example exhibit",
      artwork_title: "Water Lilies",
    },
    {
      exhibit_title: "example exhibit",
      artwork_title: "The Carrot Puller",
    },
    {
      exhibit_title: "example exhibit",
      artwork_title: "Weeping Tree",
    },
    {
      exhibit_title: "example exhibit",
      artwork_title: "Olive Trees",
    },
    // {
    //   exhibit_title: "my favourite cat photos",
    //   artwork_title: "Weeping Tree",
    // },
    // {
    //   exhibit_title: "my favourite dog photos",
    //   artwork_title: "Olive Trees",
    // }
  ],
};
