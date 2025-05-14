module.exports = {
  publicPath: '/friendmatch_finder/',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].base = '/friendmatch_finder/';
      return args;
    });
  }
};