const https = require("https");
const FormData = require("form-data");

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    const form = new FormData();

    form.append("file", buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    form.append("upload_preset", "test_unsigned");

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