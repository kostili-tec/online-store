module.exports = {
  moduleFileExtensions: ['js', 'ts'], // расширения файлов, которые будут тестироваться
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['\\\\node_modules\\\\'], // где тесты искать не нужно
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|webp|ttf|woff|woff2)$': "<rootDir>/tests/assetsStub.js",
    },
  transform: {
      '^.+\\.(js|jsx)?$': 'ts-jest',
  },
};