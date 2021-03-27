const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: {
    background: path.resolve(__dirname, "./src/background/background.js"),
    options: path.resolve(__dirname, "./src/options/options.js"),
    browserAction: path.resolve(
      __dirname,
      "./src/browser-action/browser-action.js",
    ),
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  module: {
    rules: [
      // specify css rules
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },

  plugins: [
    new HTMLPlugin({
      filename: "options.html",
      chunks: ["options"],
      template: path.resolve(__dirname, "./src/options.html"),
    }),
    new HTMLPlugin({
      filename: "background.html",
      chunks: ["background"],
      template: path.resolve(__dirname, "./src/background.html"),
    }),
    new HTMLPlugin({
      filename: "browser-action.html",
      chunks: ["browserAction"],
      template: path.resolve(__dirname, "./src/browser-action.html"),
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./static",
          to: path.resolve(__dirname, "./dist"),
        },
      ],
    }),
  ],

  resolve: {
    extensions: ["*", ".js", ".vue", ".json"],
  },
};
