const moment = require('moment')
const path =require('path')
const promise = require('bluebird')
const readfile = promise.promisify(require('fs').readFile)
module.exports = app => {
	return class programpaycontroller extends app.Controller{
		async sendcoupon () {
			const { ctx } = this
			const createRule = {
				token: 'string',
				coupon_stock_id: 'string',
				openid_count: 'number',
			}
			const body = ctx.request.body
			console.log( 'body', body )
			ctx.validate( createRule )
			let { token, coupon_stock_id, openid_count } = body
			token = await ctx.service.jwt.verify( token )
			const openid = token.openid
			const mch = app.config.mch
			const { mch_id, key, appid, appsecret } = mch 
			const nonce_str = await ctx.service.util.getnonce()
			let now = new Date(new Date().setHours(0,0,0,0))
			now = moment(now).format('YYYYMMDD')
			let string = ''
			for(let i = 0; i < 6; i++){
				let num = Math.floor( Math.random()*10 )
				string+= num
			}
			let partner_trade_no = mch_id + now + string
			const couponsign = await ctx.service.program.createcouponsign(coupon_stock_id, openid_count, partner_trade_no, openid, appid, mch_id, nonce_str, key)
			const result = await ctx.service.program.sendcoupon( coupon_stock_id, openid_count, partner_trade_no, openid, appid, mch_id, nonce_str, couponsign )
			console.log('result', result)
			console.log( '---------------------------------', typeof(coupon_stock_id), typeof(openid_count), typeof(partner_trade_no), typeof(openid), typeof(appid), typeof(mch_id), typeof(nonce_str))
			ctx.body = now
		}
		async pay () {
			const { ctx } = this
			const createRule = {
				body: 'string',
				total_fee: 'number',
				notify_url: 'string',
				token: 'string'
			}
			ctx.validate(createRule)
			const mch = app.config.mch
			const miniprogram = app.config.miniprogram
			const appid = miniprogram.appid
			const { appsecret, mch_id, key } = mch
			const header = ctx.header
			const spbill_create_ip = header['x-real-ip']
			const reqbody = ctx.request.body
			let { body, total_fee, notify_url, token } = reqbody
			token = await ctx.service.jwt.verify( token )
			const openid = token.openid
			const out_trade_no = await ctx.service.util.getnonce()
			const nonce_str = await ctx.service.util.getnonce()
			const trade_type = 'JSAPI'
			const sign = await ctx.service.program.createsign(appid, mch_id, nonce_str, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, openid, key)
			let result = await ctx.service.program.programpay(appid, mch_id, nonce_str, sign, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, openid)
			result = await ctx.service.util.parsexml( result )
			console.log('result', result)
			let prepay_id = result.xml['prepay_id'][0]
			const thepackage = `prepay_id=${prepay_id}`
			const nonceStr = await ctx.service.util.getnonce()
			let timeStamp = Math.floor( (new Date().getTime())/1000 )
			timeStamp = timeStamp.toString()
			const signType = 'MD5'
			console.log(appid, timeStamp, nonceStr, thepackage, signType, key)
			const paysign = await ctx.service.program.createpaysign( appid, timeStamp, nonceStr, thepackage, signType, key )
			console.log('paysign', paysign)
			const payform = {
				timeStamp: timeStamp,
				nonceStr: nonceStr,
				package: thepackage,
				signType: signType,
				paySign: paysign
			}
			ctx.body = {
				data : payform
			}
		}
		async paynotify () {
			const { ctx } = this
			ctx.body = 'zzz'
		}
	}
}