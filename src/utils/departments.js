const departmentFilterToAPI = {
  "European Art": {
    chicago: ["Applied Arts of Europe", "Painting and Sculpture of Europe"],
    met: ["European Paintings", "European Sculpture and Decorative Arts"],
  },
  "Asian Art": {
    chicago: ["Arts of Asia"],
    met: ["Asian Art"],
  },
  "Greek, Roman and Byzantium Art": {
    chicago: ["Arts of Greece, Rome, and the Byzantium"],
    met: ["Greek and Roman Art"],
  },
  "Modern and Contemporary Art": {
    chicago: ["Contemporary Art", "Modern Art, Modern and Contemporary Art"],
    met: ["Modern Art"],
  },
  "Arts of the Americas": {
    chicago: ["Arts of the Americas"],
    met: ["American Decorative Arts"],
  },
  "Ancient Near Eastern Art": { met: ["Ancient Near Eastern Art"] },
  "Arms and Armor": { met: ["Arms and Armor"] },
  "Arts of Africa, Oceania, and the Americas": {
    chicago: ["Arts of Africa"],
    met: ["Arts of Africa, Oceania, and the Americas"],
  },
  "The Cloisters": { met: ["The Cloisters"] },
  "The Costume Institute": { met: ["The Costume Institute"] },
  "Drawings and Prints": {
    chicago: ["Prints and Drawings"],
    met: ["Drawings and Prints"],
  },
  "Egyptian Art": { met: ["Egyptian Art"] },
  "Islamic Art": { met: ["Islamic Art"] },
  "The Robert Lehman Collection": { met: ["The Robert Lehman Collection"] },
  "The Libraries": { met: ["The Libraries"] },
  "Medieval Art": { met: ["Medieval Art"] },
  "Musical Instruments": { met: ["Musical Instruments"] },
  Photographs: { chicago: ["Photography and Media"], met: ["Photographs"] },
  "Architecture and Design": { chicago: ["Architecture and Design"] },
  "Research Center": { chicago: ["Research Center"] },
  Textiles: { chicago: ["Textiles"] },
};

const metDepartmentIDs = [
  { departmentId: 1, displayName: "American Decorative Arts" },
  { departmentId: 3, displayName: "Ancient Near Eastern Art" },
  { departmentId: 4, displayName: "Arms and Armor" },
  { departmentId: 5, displayName: "Arts of Africa, Oceania, and the Americas" },
  { departmentId: 6, displayName: "Asian Art" },
  { departmentId: 7, displayName: "The Cloisters" },
  { departmentId: 8, displayName: "The Costume Institute" },
  { departmentId: 9, displayName: "Drawings and Prints" },
  { departmentId: 10, displayName: "Egyptian Art" },
  { departmentId: 11, displayName: "European Paintings" },
  { departmentId: 12, displayName: "European Sculpture and Decorative Arts" },
  { departmentId: 13, displayName: "Greek and Roman Art" },
  { departmentId: 14, displayName: "Islamic Art" },
  { departmentId: 15, displayName: "The Robert Lehman Collection" },
  { departmentId: 16, displayName: "The Libraries" },
  { departmentId: 17, displayName: "Medieval Art" },
  { departmentId: 18, displayName: "Musical Instruments" },
  { departmentId: 19, displayName: "Photographs" },
  { departmentId: 21, displayName: "Modern Art" },
];

const departmentNames = Object.keys(departmentFilterToAPI);

module.exports = {
  departmentFilterToAPI,
  metDepartmentIDs,
  departmentNames,
};
