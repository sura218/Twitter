export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('http://localhost:5500/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  return data.url
}