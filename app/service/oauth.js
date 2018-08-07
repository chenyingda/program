const config={
	appid:'wx667a2ac6f5ef7a46',
	appsecret:'e912880f1a6343fe5b734b050ddbe3b7',
	prefix:'https://open.weixin.qq.com/connect/oauth2/authorize?'
}
const urlencode=require('urlencode')
const promise=require('bluebird')
const request=promise.promisify(require('request'))
module.exports=app=>{
	return class oauthservice extends app.Service{
		async getcode(redirect_uri){
			console.log('11111111111111',redirect_uri)
			let url=config.prefix+'appid='+config.appid+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
			return url
		}
		async gettoken(code){
			const url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config.appid+"&secret="+config.appsecret+"&code="+code+"&grant_type=authorization_code"
			let data=await request({url:url,method:'POST',json:true})
			return new Promise((resolve,reject)=>{
				if(data){
					resolve(data.body)
				}else{
					this.ctx.throw(404)
				}
			})
		}
	}
}