module.exports = {
	devServer: {
			proxy: {
					"/api/*": {
							//target: "http://localhost:6600",
							target: "http://localhost:3000",
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