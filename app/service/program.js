const request = require('request-promise-native')
const promise = require('bluebird')
const readfile = promise.promisify(require('fs').readFile)
const path = require('path')
const md5 = require('md5')
module.exports=app=>{
	return class programservice extends app.Service{
		//小程序后去accesstoken
		async getaccesstoken(){
			const { ctx } = this;
			let accesstoken = await app.redis.get('miniaccesstoken');
			console.log('--------------accesstoken------------', accesstoken)
			if(accesstoken!=null && accesstoken!=undefined){
				accesstoken = JSON.parse(accesstoken);
				const { token, expiresin } = accesstoken;
				const now = new Date().getTime();
				if(expiresin < now){
					await this.updateaccesstoken()
				}
			}else{
				await this.updateaccesstoken()
			}
			accesstoken = await app.redis.get("miniaccesstoken")
			accesstoken = JSON.parse(accesstoken)
			accesstoken = accesstoken.token
			return accesstoken
		}

		//小程序更新accesstoken
		async updateaccesstoken(){
			const { ctx } = this
			const config =  await ctx.service.config.findminibyname();
			const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.appsecret}` 
			const data = await request({url, method: 'POST', json: true})
			const now = new Date().getTime()
			const { access_token, expires_in} = data
			let form = {
				token : access_token,
				expiresin : now + (7200-20)*1000
			}
			form = JSON.stringify(form)
			await app.redis.set("miniaccesstoken" , form)
		}		

		//小程序用户登录获取临时code
		async login(code){
			const { ctx } = this;
			const config = await ctx.service.config.findminibyname();
			const appid = config.get('appid');
			const appsecret = config.get('appsecret');
			const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`
			const data = await request({url, method: 'POST', json:true})
			return data
		}

		//小程序发送模板消息给用户
		async sendtemplate(touser, template_id, form_id, data){
			const token = await this.getaccesstoken()
			console.log('token', token)
			const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`
			const form = { touser, template_id, form_id, data}
			const result = await request({url, method:'POST', json:true, body:form})
			return result
		}
		async decryptcardcode ( form ) {
			const { ctx } =  this;
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken')
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = "https://api.weixin.qq.com/card/code/decrypt?access_token=" + accessToken
			const result = await request({ url, body: form, method: "POST", json: true})
			console.log('------------------------', result)
			const { code } = result
			return code
		}
		async checkandconsumecardcode ( code ) {
			const { ctx } =  this;
			let api = await ctx.service.wxapi.index()
			let apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken')
			token = JSON.parse(token)
			let accessToken = token.accessToken
			let url = "https://api.weixin.qq.com/card/code/get?access_token=" + accessToken
			let form = { code }
			form.check_consume = true
			const result = await request({ url, body: form, method: 'POST', json: true})
			console.log('result', result)
			const { can_consume } = result
				apivalid = await api.ensureAccessToken()
				token = await app.redis.get('publicaccesstoken')
				token = JSON.parse( token )
				accessToken = token.accessToken
				url = "https://api.weixin.qq.com/card/code/consume?access_token=" + accessToken
				const newform = { code }
				const newresult = await request({ url, method: 'POST', body: newform, json: true})
				console.log('this is newresult', newresult)
				return newresult
		}

		async createcouponsign (coupon_stock_id, openid_count, partner_trade_no, openid, appid, mch_id, nonce_str, key ) {
			let config = {
				coupon_stock_id: coupon_stock_id,
				openid_count: openid_count,
				partner_trade_no: partner_trade_no,
				openid: openid,
				appid: appid,
				mch_id: mch_id,
				nonce_str: nonce_str
			}
			let keys = Object.keys(config)
			keys = keys.sort()
			let sign = ''
			for(let i in keys){
				let val = config[keys[i]]
				if(config[keys[i]]!=''){
						let keystr = keys[i]+'=' + val + '&'
						sign+= keystr
				}
			}
			sign+= 'key=' + key
			sign = md5(sign).toUpperCase()
			return sign
		}
		async sendcoupon ( coupon_stock_id, openid_count, partner_trade_no, openid, appid, mch_id, nonce_str, sign ) {
			const body = `<xml>
				<appid>${appid}</appid>
				<coupon_stock_id>${coupon_stock_id}</coupon_stock_id>
				<mch_id>${mch_id}</mch_id>
				<nonce_str>${nonce_str}</nonce_str>
				<openid>${openid}</openid>
				<openid_count>1</openid_count>
				<partner_trade_no>${partner_trade_no}</partner_trade_no>
				<sign>${sign}</sign>
				</xml>` 
			console.log('body', body)
			const url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/send_coupon"
			const fpath = path.join(__dirname, '../../apiclient_cert.p12')
			const pfx = await readfile(fpath)
			const result = await request({ url, body: body, agentOptions: {pfx, passphrase: mch_id}, method: 'POST'})
			return result
		}
		async createsign ( appid, mch_id, nonce_str, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, openid, key ) {
			const config = {
				appid: appid,
				mch_id: mch_id,
				nonce_str: nonce_str,
				body: body,
				out_trade_no, out_trade_no,
				total_fee: total_fee,
				spbill_create_ip: spbill_create_ip,
				notify_url: notify_url,
				trade_type: trade_type,
				openid: openid
			}
			let keys = Object.keys(config)
			keys = keys.sort()
			let sign = ''
			for(let i in keys){
				let val = config[keys[i]]
				if(config[keys[i]]!=''){
						let keystr = keys[i]+'=' + val + '&'
						sign+= keystr
				}
			}
			sign+= 'key=' + key
			sign = md5(sign).toUpperCase()
			return sign
		}
		async programpay ( appid, mch_id, nonce_str, sign, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, openid ) {
			const { ctx } = this 
			const xml = `
				<xml>
				   <appid>${appid}</appid>
				   <body>${body}</body>
				   <mch_id>${mch_id}</mch_id>
				   <nonce_str>${nonce_str}</nonce_str>
				   <notify_url>${notify_url}</notify_url>
				   <openid>${openid}</openid>
				   <out_trade_no>${out_trade_no}</out_trade_no>
				   <spbill_create_ip>${spbill_create_ip}</spbill_create_ip>
				   <total_fee>${total_fee}</total_fee>
				   <trade_type>${trade_type}</trade_type>
				   <sign>${sign}</sign>
				</xml>
			`
			const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
			const result = await request({url, body:xml, method: 'POST'})
			return result
		}
		async createpaysign ( appid, timeStamp, nonceStr, thepackage, signType, key ) {
			const config = {
				appid: appid,
				timeStamp: timeStamp,
				nonceStr: nonceStr,
				package: thepackage,
				signType: signType
			}
			console.log('--------------------', config)
			let keys = Object.keys(config)
			keys = keys.sort()
			let sign = ''
			for(let i in keys){
				let val = config[keys[i]]
				if(config[keys[i]]!=''){
						let keystr = keys[i]+'=' + val + '&'
						sign+= keystr
				}
			}
			sign+= 'key=' + key
			console.log('newsign', sign)
			sign = md5( sign ).toUpperCase()
			return sign
		}
	}
}