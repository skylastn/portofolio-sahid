export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
};

export const ENV = {
  minioEndpoint: process.env.MINIO_ENDPOINT,
  minioAccessKey: process.env.MINIO_ACCESS_KEY,
  minioSecretKey: process.env.MINIO_SECRET_KEY,
  minioBucket: process.env.MINIO_BUCKET,
};
