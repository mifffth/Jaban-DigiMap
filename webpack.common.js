const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/scripts/index.js"),
    // map: path.resolve(__dirname, "src/scripts/views/map-view.js"),
    // credit: path.resolve(__dirname, "src/scripts/views/credit-view.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      excludeChunks: ["sw"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public/"),
          to: path.resolve(__dirname, "dist/"),
        },
        {
          from: path.resolve(__dirname, "src/styles"),
          to: path.resolve(__dirname, "dist/styles"),
        },
        {
          from: path.resolve(__dirname, "src/app.webmanifest"),
          to: path.resolve(__dirname, "dist/app.webmanifest"),
        },
      ],
    }),
  ],
};
