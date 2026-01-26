const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImageFromBase64(base64String, folder = 'general', filename = null) {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        public_id: filename,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return result.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async uploadImageFromBuffer(buffer, folder = 'general', filename = null) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteImage(imageUrl) {
    try {
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }

  extractPublicId(imageUrl) {
    try {
      const matches = imageUrl.match(/\/upload\/v\d+\/(.+?)\./);
      return matches ? matches[1] : null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new CloudinaryService();
