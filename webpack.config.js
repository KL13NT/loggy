const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  devtool: "inline-source-map",

  entry: {
    background: "./src/background/background.js",
    options: "./src/options/options.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
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
    new HTMLWebpackPlugin({
      filename: "options.html",
      chunks: ["options"],
      template: "./static/options.html",
    }),
    new HTMLWebpackPlugin({
      filename: "background.html",
      chunks: ["background"],
      template: "./static/background.html",
    }),
    new VueLoaderPlugin(),
  ],

  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
};
