const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");

const entry = "./src/assets/main.js";
const outputPath = "./dist/assets";

const isDev = process.env.NODE_ENV !== "production";

const cssRule = {
  test: /\.css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: false,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            postcssImport({
              from: "./src/assets/css/index.css",
            }),
            postcssPresetEnv({
              stage: 2,
              features: {
                "logical-properties-and-values": false,
                "nesting-rules": true
              },
            }),
          ],
        },
      },
    },
  ],
};

const jsRule = {
  test: /\.m?js$/i,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
  },
};

const fontRule = {
  test: /\.(woff2)$/i,
  type: "asset/resource",
  generator: {
    filename: `fonts/${isDev ? "[name][ext]" : "[hash][ext][query]"}`,
  },
};

const iconRule = {
  test: /\.(ico|svg)$/i,
  type: "asset/resource",
  generator: {
    filename: "[name][ext]",
  },
};

module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  entry,
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: isDev ? "[name].js" : "[contenthash].js",
    publicPath: "/assets/",
  },
  module: {
    rules: [cssRule, jsRule, fontRule, iconRule],
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
    }),
  ],
  stats: {
    children: true,
  },
};
