// photos/userId/photoKey -> photoKey
export const getPhotoKeyFromBucketPath = (path: string) => {
  return path.split('/')[2]
}