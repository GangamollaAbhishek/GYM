const cloudinary = require('../../config/cloudinary');

// Handle Cloudinary upload with data URL fallback
const handleUpload = async (req, res) => {
  try {
    const { image, folder = 'titan_avatars' } = req.body;
    if (!image) {
      return res.status(400).json({ status: 'error', message: 'No image data provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: folder || 'titan_avatars',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
      ],
    });

    return res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResponse.secure_url || uploadResponse.url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    if (req.body.image && req.body.image.startsWith('data:image')) {
      return res.status(200).json({
        status: 'success',
        message: 'Image processed successfully',
        url: req.body.image,
      });
    }
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to upload image to Cloudinary' });
  }
};

module.exports = {
  handleUpload,
};
