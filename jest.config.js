module.exports = {
    testEnvironment: "node",
    projects: [
        {
            displayName: "server",
            testMatch: ["<rootDir>/server/**/*.test.js"],
            testEnvironment: "node",
        },
        {
            displayName: "client",
            testMatch: ["<rootDir>/client/**/*.test.js"],
            setupFilesAfterEnv: ["<rootDir>/client/src/setupTests.js"],
            testEnvironment: "jsdom",
            moduleNameMapper: {
                "\\.(css|less|scss|sass)$": "identity-obj-proxy",
            },
        },
    ],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
};
