var gulp = require("gulp");
var webpackStream = require("webpack-stream");
var webpack = require("webpack");
var nodeExternals = require("webpack-node-externals");
var uglify = require("gulp-uglify");

var files = {
  js: "src/**/*.js"
};


var webpackOptions = {
  target: "node",

  externals: [nodeExternals()],

  node: {
    __dirname: false,
    __filename: false
  },

  entry: {
    javascript: "./src/app.js"
  },

  output: {
    filename: "mint.server.min.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"],
          cacheDirectory: true
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        //'NODE_ENV': '"production"'
        'NODE_ENV': '"development"'
      }
    })
  ]
};

gulp.task("default", ["watch", "build-node"]);

gulp.task("build-node", function(){

  return gulp.src(files.js)
    .pipe(webpackStream(webpackOptions))
    //.pipe(uglify())
    .pipe(gulp.dest("./"));
});

gulp.task('watch', function(){
	gulp.watch(files.js, ['build-node']);
});
