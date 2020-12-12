const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    path: path.resolve(__dirname, "build")
  },
  entry: { index: path.resolve(__dirname, "src", "index.js") },
  module: {
    rules: [
      {
        test: /\.js$/, //using regex to tell babel exactly what files to transcompile
        exclude: /node_modules/, // files to be ignored
        use: {
          loader: 'babel-loader' // specify the loader
        }
      },
    ]
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    })
  ]
};