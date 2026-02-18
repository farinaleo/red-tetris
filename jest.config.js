module.exports = {
    // Configuration pour les tests côté serveur (Node.js)
    testEnvironment: "node",
    // Configuration pour les tests côté client (JSDOM)
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
    // Génération de la couverture de code
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
};
