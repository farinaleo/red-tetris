import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs", // enforces require/module.exports
            globals: {
                require: "readonly",
                module: "writable",
                exports: "writable",
                __dirname: "readonly",
                __filename: "readonly",
                process: "readonly",
                console: "readonly",
                clearInterval: "readonly",
                setInterval:   "readonly",
                setTimeout:    "readonly",
                clearTimeout:  "readonly",  // add this too while you're at it
            },
        },
        rules: {
            // ─── Ban ES module syntax ───────────────────────────────────────
            "no-restricted-syntax": [
                "error",
                {
                    selector: "ImportDeclaration",
                    message: "Use require() instead of import.",
                },
                {
                    selector: "ExportNamedDeclaration",
                    message: "Use module.exports instead of export.",
                },
                {
                    selector: "ExportDefaultDeclaration",
                    message: "Use module.exports instead of export default.",
                },
                // ─── Enforce OOP: ban standalone functions at module scope ────
                {
                    selector:
                        "Program > ExpressionStatement > AssignmentExpression[left.object.name='module'][left.property.name='exports'][right.type='Literal']",
                    message: "module.exports must be a class or object, not a primitive.",
                },
                {
                    selector:
                        "Program > ExpressionStatement > AssignmentExpression[left.object.name='module'][left.property.name='exports'][right.type='ArrowFunctionExpression']",
                    message: "module.exports must be a class or object, not a bare arrow function.",
                },
                {
                    selector:
                        "Program > ExpressionStatement > AssignmentExpression[left.object.name='module'][left.property.name='exports'][right.type='FunctionExpression']",
                    message: "module.exports must be a class or object, not a bare function.",
                },
                {
                    // Ban top-level function declarations (encourage class methods instead)
                    selector: "Program > FunctionDeclaration",
                    message:
                        "Top-level functions are not allowed. Use class methods instead.",
                },
            ],

            // ─── OOP enforcement ────────────────────────────────────────────
            // Require constructor in classes
            "class-methods-use-this": "warn",

            // Disallow calling a class as a plain function
            "new-cap": ["error", { newIsCap: true, capIsNew: true }],

            // No standalone var/let/const at module root holding functions
            // (use class static methods instead)
            "no-restricted-globals": [
                "error",
                {
                    name: "arguments",
                    message: "Use class method parameters instead.",
                },
            ],

            // ─── Code quality ───────────────────────────────────────────────
            "no-var": "error",           // prefer const/let
            "prefer-const": "error",
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "warn",
            "no-useless-assignment": "warn"
        },
    },
    {
        ignores: [
            "dist/**",
            "build/**",
            "node_modules/**",
            "coverage/**",
            "*.min.js",
            "**/*.test.js",
            "**/setupTests.js"
        ],
    },
];