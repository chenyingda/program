const API = require('co-wechat-api')
module.exports=app=>{
	return class wxapiservice extends app.Service{
		async index(){
			const { ctx } = this;
			const config = await ctx.service.config.findpublicbyname()
			const api = new API(config.appid, config.appsecret, async()=>{
				let token = await app.redis.get('publicaccesstoken')
				token = JSON.parse(token)
				return token
			}, async(token)=>{
				token = JSON.stringify(token)
				await app.redis.set('publicaccesstoken', token)
			});
			api.setOpts({timeout: 15000});
			return api;
		}
	}
}