const { merge } = require("webpack-merge");
const common = require("./webpack.config.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval",

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
});
