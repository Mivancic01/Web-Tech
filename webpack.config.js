const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
          {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"]
          }
        ]
    },
    optimization: {
      splitChunks: { chunks: "all" }
    },
    output: {
        path: path.resolve(__dirname, "build")
    },
    entry: { index: path.resolve(__dirname, "src", "index.js") },
    plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "src", "index.html")
        })
    ]
};