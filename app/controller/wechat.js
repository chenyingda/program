const wechat = require('co-wechat')
module.exports = app => {
	class wechatcontroller extends app.Controller{

	}
	wechatcontroller.prototype.index = wechat({
		token : app.config.publicprogram.token,
		appid: app.config.publicprogram.appid,
		encodingAESKey: app.config.publicprogram.encodingaeskey
	}).middleware(async(message, ctx)=>{
		const info = await ctx.service.wechat.index(message)
		return info
	})

	//调用co-wechat的middleware函数,传入一个handle函数,middleware将结果已回调函数的形式返还给外部,外部再将结果中的用户信息作处理
	//并将处理过之后所得到的回复消息返回给middleware
	return wechatcontroller
}