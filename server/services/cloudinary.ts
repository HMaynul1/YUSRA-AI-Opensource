import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (
  file: Buffer,
  fileName: string,
  folder: string = 'yusra-ai'
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: fileName.split('.')[0],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve({
          url: result?.secure_url || '',
          publicId: result?.public_id || '',
        })
      }
    )
    stream.end(file)
  })
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}

export const getCloudinaryUrl = (publicId: string): string => {
  return cloudinary.url(publicId, { secure: true })
}
