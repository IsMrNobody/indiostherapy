// Utilidad para subir imágenes base64 a Cloudinary desde el frontend
// Requiere: tu cloud_name y un upload_preset configurado como unsigned en Cloudinary

export async function uploadToCloudinary(base64, cloudName, uploadPreset) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', base64);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Error subiendo imagen a Cloudinary');
  const data = await response.json();
  return data.secure_url;
}
