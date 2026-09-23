const https = require("https");
const FormData = require("form-data");

const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || "test_unsigned";

    if (!cloudName) {
      return reject(new Error("CLOUDINARY_CLOUD_NAME is missing from .env"));
    }

    const form = new FormData();
    form.append("file", buffer, {
      filename: options.filename || "image.jpg",
      contentType: options.contentType || "image/jpeg",
    });
    form.append("upload_preset", uploadPreset);

    if (folder) {
      form.append("folder", folder);
    }

    const request = https.request(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: form.getHeaders(),
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const result = JSON.parse(data);

            if (response.statusCode >= 200 && response.statusCode < 300) {
              return resolve(result);
            }

            console.error("CLOUDINARY ERROR:", result);
            reject(
              new Error(
                result?.error?.message ||
                  `Cloudinary upload failed: ${response.statusCode}`
              )
            );
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on("error", reject);
    form.pipe(request);
  });
};

module.exports = uploadToCloudinary;
