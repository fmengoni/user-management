export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV,
  isE2E:
    process.env.NODE_ENV?.startsWith('e2e') ||
    process.env.NODE_ENV?.startsWith('local'),
  mongodb: {
    user: process.env.MONGO_DB_USER,
    password: process.env.MONGO_DB_PASS,
    host: process.env.MONGO_DB_URL,
    schema: process.env.MONGO_DB_SCHEMA,
  },
});
