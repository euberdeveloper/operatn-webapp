module.exports = {
	devServer: {
			proxy: {
					"/api/*": {
							//target: "http://localhost:6600",
							target: "http://localhost/api",
							secure: false
					}
			}
	},
	chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Portineria Opera Universitaria';
        return args;
      });
  },
};