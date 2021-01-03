const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const postcssNormalize = require("postcss-normalize");
const postcssPresetEnv = require("postcss-preset-env");

const entry = "./src/assets/main.js";
const outputPath = "./dist/assets";

const isDev = process.env.NODE_ENV !== "production";

console.log(process.env.NODE_ENV);

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
            postcssNormalize(),
            postcssPresetEnv({
              stage: 2,
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

const fileRule = {
  test: /\.(png|jpe?g|gif|woff|woff2)$/i,
  use: {
    loader: "file-loader",
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
    rules: [cssRule, jsRule, fileRule],
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
    }),
  ],
};
