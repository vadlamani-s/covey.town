module.exports = {
  plugins: ['prettier'],
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './services/roomService/tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  ignorePatterns: ['/*.*'],
  rules: {
    'no-underscore-dangle': 0,
  },
};
