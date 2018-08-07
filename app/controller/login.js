const sha = require('sha1')
const urlencode=require('urlencode')
module.exports=app=>{
	return class logincontroller extends app.Controller{
		async login(){
			const { ctx } = this;
			const createRule = {
				"code": "string"
			}
			ctx.validate(createRule);
			const body = ctx.request.body;
			const { code } = body;
			console.log('this is code', code);
			const result = await ctx.service.program.login(code);
			console.log('this is result',result);
			const sessionKey = result.session_key
			const openid = result.openid;
			console.log('this is openid', openid);
			const token = await ctx.service.jwt.sign(openid);
			console.log("token", token)
			ctx.body={
				code: 200,
				data: token,
				sessionKey: sessionKey
			}	
		}
		async sign () {
			const { ctx } = this;
			const publicaccesstoken = await app.redis.get('publicaccesstoken')
			console.log('-------------publicaccesstoken-------------', publicaccesstoken)
			const createRule = {
				"token": 'string',
				"card_id": 'string'
			}
			ctx.validate( createRule )
			const body = ctx.request.body;
			let { token, card_id } = body
			token = await ctx.service.jwt.verify(token)
			const openid = token.openid
			console.log('openid', openid)
			const nonce_str = await ctx.service.util.getnonce()
			let timestamp = Math.floor((new Date().getTime())/1000)
			const api_ticket = await ctx.service.wechat.getapiticket()
			console.log('-------api_ticket----------', api_ticket)
			let form = {
				api_ticket: api_ticket,
				timestamp: timestamp,
				nonce_str: nonce_str,
				card_id: card_id
			}
			let signature = await ctx.service.util.sort( form )
			signature = sha( signature )
			let data = {
				timestamp: timestamp,
				signature: signature,
				nonce_str: nonce_str
			}
			data = JSON.stringify(data)
			console.log('data', data)
			console.log('------------type--------------', typeof(data))
			ctx.body = {
				data: data
			}
		}
		async del(){
			const { ctx } = this
			await app.redis.del('miniaccesstoken')
			await app.redis.del('publicaccesstoken')
			await app.redis.del('apiticket')
			ctx.body = 'zzz'
		}
		async carddecode(){
			const { ctx } = this
			console.log('------------------', ctx.request.body)
			const createRule = {
				token: 'string',
				code: 'string'
			}
			ctx.validate( createRule )
			const body = ctx.request.body
			let { token, code } = body
			token = await ctx.service.jwt.verify( token )
			const openid = token.openid
			let form = {}
			form.encrypt_code = code
			code = await ctx.service.program.decryptcardcode( form )
			// await ctx.service.program.checkandconsumecardcode( code )
			ctx.body = {
				data : code
			}
		}	
		async decodeencryptedData(){
			const { ctx } = this
			const createRule = {
				encryptedData: "string",
				iv: "string",
				sessionKey: 'string'
			}
			ctx.validate(createRule)
			const body = ctx.request.body 
			const { encryptedData, iv, sessionKey } = body
			console.log(encryptedData, iv, sessionKey)
			const data = await ctx.service.util.decodeencryptedData(encryptedData, iv, sessionKey )
			console.log('---------data---------', data)
			ctx.body = 'zzzz'
		}
	}
}