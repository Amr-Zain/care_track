const config = {
  development: {
    url: process.env.DB_PUBLIC_URL,
    dialect: 'mysql',
    migrationStorageTableName: 'migrations',
  },
  test: {
    url: process.env.DB_PUBLIC_URL,
    dialect: 'mysql',
    migrationStorageTableName: 'migrations',
  },
  production: {
    url: process.env.DB_PUBLIC_URL,
    dialect: 'mysql',
    migrationStorageTableName: 'migrations',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;