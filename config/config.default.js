'use strict';

const whitelist = [
  // images
  '.jpg', '.jpeg', // image/jpeg
  '.png', // image/png, image/x-png
  '.gif', // image/gif
  '.bmp', // image/bmp
  '.wbmp', // image/vnd.wap.wbmp
  '.webp',
  '.tif',
  '.psd',
  // text
  '.svg',
  '.js', '.jsx',
  '.json',
  '.css', '.less',
  '.html', '.htm',
  '.xml',
  // tar
  '.zip',
  '.gz', '.tgz', '.gzip',
  // video
  '.mp3',
  '.mp4',
  '.avi',
];


module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532600673558_1754';

  // add your config here
  config.middleware = [];

  config.miniprogram = {
  		appid: "wxfe39e5ab154a0ce3",
  		appsecret: "b1ae76e66cf7a2609f92e327c6da0f9e",
  		token: "cyd",
  		encodingaeskey: "FjezAes25AjLrZbNSMfsZ17sUsYZh4mFnXyhD3lXpfO"
  	}

  config.publicprogram = {
	    appid: 'wx667a2ac6f5ef7a46',
	    appsecret: 'e912880f1a6343fe5b734b050ddbe3b7',
	    token: 'cyd',
	    encodingaeskey: 'pjQhD7BSVF92KmHNUOXwcTlsn8rhNJGeS7QzG06WJwm' 	
  	}

  config.mch = {
    appid: 'wx667a2ac6f5ef7a46',
    appsecret: 'e912880f1a6343fe5b734b050ddbe3b7',
    mch_id: '1454784202',
    key: 'BDHv2TcNHRVaUzbGFwU4FsjReyfqFf87'
  }

  config.sequelize={
	    dialect: 'mysql', 
	    database: 'wxsql',
	    host: '127.0.0.1',
	    port: '3306',
	    username: 'root',
	    password: '',
      timezone: '+08:00' 	
 	 }

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0,
    },
  }	 

  config.security = {
    	csrf: false
  	} 

  config.cluster = {
  	listen: {
  		port: 80
  	}
  }

  config.multipart = {
    whitelist: whitelist,
    fileSize: '10mb'
  }

  config.view={
    mapping:{
      '.ejs':'ejs'
    }
  } 

   return config;
};
