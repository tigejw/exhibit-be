exports.missingImage = function (image, fallback = "/assets/Drawing.png") {
  if (!image || typeof image !== "string" || image.trim() === "" || image === "N/A") {
    return fallback;
  }
  return image;
}
