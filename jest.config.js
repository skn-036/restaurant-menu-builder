/** @type {import('ts-jest').JestConfigWithTsJest} */
const path = require('path');
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    moduleNameMapper: {
        '@/(.*)': `${path.resolve(__dirname).split('\\').join('/')}/src/$1`,
    },
    verbose: true,
    forceExit: true,
    clearMocks: true,
    // collectCoverage: true,
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/client/'],
};
