const path = require("path");
const glob = require("glob");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const WorkboxPlugin = require('workbox-webpack-plugin');

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

const entries = {};
glob.sync("javascript/packs/*.{ts,tsx}").forEach((filePath) => {
  const name = path.basename(filePath, path.extname(filePath));
  entries[name] = path.resolve(__dirname, filePath);
});

module.exports = [
  {
    mode: isProd ? "production" : "development",
    devtool: isProd ? "nosources-source-map" : "source-map",
    entry: entries,
    output: {
      path: path.resolve(__dirname, "public/packs"),
      publicPath: "/packs/",
      filename: "[name].js",
    },
    optimization: {
      splitChunks: {
        name: "vendor",
        chunks: "initial",
      },
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: false,
            compress: {
              ecma: "2017",
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "resolve-url-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_module/,
          use: {
            loader: "ts-loader",
            options: {
              instance: "main",
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
          use: {
            loader: "file-loader",
          },
        },
      ],
    },
    plugins: [
      new WebpackAssetsManifest({ publicPath: true }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "audience.html",
        chunks: ["audience"],
        hash: false,
        inject: false,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "admin.html",
        chunks: ["admin"],
        hash: false,
        inject: false,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "contestant.html",
        chunks: ["contestant"],
        hash: false,
        inject: false,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackHarddiskPlugin({
        outputPath: "./public",
      }),
    ],
  },
  {
    mode: isProd ? "production" : "development",
    devtool: isProd ? "nosources-source-map" : "source-map",
    entry: {
      sw: path.resolve(__dirname, "./sw/src/sw.ts"),
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      publicPath: "/",
      filename: "[name].js",
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: false,
            compress: {
              ecma: "2017",
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./sw/tsconfig.json"),
              instance: "sw",
            },
          },
        },
      ],
    },
    plugins: [],
  },
];
