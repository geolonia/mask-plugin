import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from "path";
import webpack from "webpack";

export const templates = path.resolve(__dirname, 'templates')
export const assets = path.resolve(__dirname, 'assets')
export const dest = path.resolve(__dirname, "docs")

const config: webpack.Configuration = {
  mode: 'production',
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(templates, 'index.html') }),
    new CopyWebpackPlugin({ patterns: [{ from: assets, to: dest }] })
  ],
  devtool: 'source-map',
  output: {
    path: dest,
    filename: "hello-geolonia-plugin.min.js",
  },
};

export default config
