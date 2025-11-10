module.exports = function (api) {
  api.cache(true);

  // Determine which .env file to load based on APP_ENV
  const envFile = process.env.APP_ENV === 'production'
    ? '.env.production'
    : '.env.development';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: envFile,
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
