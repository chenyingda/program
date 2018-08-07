'use strict';

// had enabled by egg
// exports.static = true;
exports.sequelize = { 
	package: 'egg-sequelize',
	enable: true
}

exports.validate = {
  enable: true,
  package: "egg-validate"
}

exports.jwt = {
	enable: true,
	package: 'egg-jwt'
}

exports.redis = {
	enable: true,
	package: 'egg-redis'
}

exports.ejs = {
	enable: true,
	package: 'egg-view-ejs'
}