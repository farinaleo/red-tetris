const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'client/public'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        configFile: './babel.config.json', // Chemin explicite vers la config
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'], // Ajoute cette règle pour les fichiers CSS
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'client/public'), // Dossier contenant index.html
        },
        compress: true,
        port: 8080,
        hot: true,
        historyApiFallback: {
            index: '/index.html', // Redirige toutes les requêtes vers index.html
        },
    },
};
