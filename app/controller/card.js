const path = require('path')
const request = require('request-promise-native')
module.exports = app => {
	return class cardcontroller extends app.Controller{
		async createcard(){
			const { ctx } = this;
			/*const form = { 
			"card": {
			  "card_type": "GROUPON",
			  "groupon": {
			      "base_info": {
			          "logo_url": materialurl, //logo
			          "brand_name":"微信餐厅",   //商户名
			          "code_type":"CODE_TYPE_TEXT", //
			          "title": "apple",
			          "sub_title": "周末狂欢必备",
			          "color": "Color010",
			          "notice": "使用时向服务员出示此券",
			          "service_phone": "020-88888888",
			          "description": "不可与其他优惠同享\n如需团购券发票，请在消费时向商户提出\n店内均可使用，仅限堂食",
			          "": {
			              "type": "DATdate_infoE_TYPE_FIX_TERM",
			              "fixed_term": 15 ,
			              "fixed_begin_term": 0
			          },
			          "sku": {
			              "quantity": 500000
			          },
			          "get_limit": 1,
			          "use_custom_code": false,
			      },
			      "deal_detail": "选择"}
			}}*/
			const createRule = {
				card : {
					type: 'object'
				}
			}
			ctx.validate(createRule)
			let body = ctx.request.body
			const filetype = 'image'
			const materialid = body.material
			const material = await ctx.service.material.findmaterialbyid( materialid )
			let modelcard = ''
			let date_info = {}
			let sku = {}
			const card_type = body.card.card.card_type
			let modelupdates = {}
			switch( card_type ){
				case 'GROUPON':
					body.card.card.groupon.base_info.logo_url = material.url
					sku = body.card.card.groupon.base_info.sku
					date_info = body.card.card.groupon.base_info.date_info
					console.log('------------------', body.card.card.groupon.base_info)
					modelcard = await ctx.service.card.create( body.card.card.groupon.base_info )
					let { deal_detail } = body.card.card.groupon
					modelupdates = { deal_detail }
					break;
				case 'CASH':
					body.card.card.cash.base_info.logo_url = material.url
					sku = body.card.card.cash.base_info.sku
					date_info = body.card.card.cash.base_info.date_info
					modelcard = await ctx.service.card.create( body.card.card.cash.base_info )
					let { least_cost, reduce_cost } = body.card.card.cash
					modelupdates = { least_cost, reduce_cost }
					break;
				case 'DISCOUNT':		
					body.card.card.discount.base_info.logo_url = material.url
					sku = body.card.card.discount.base_info.sku
					date_info = body.card.card.discount.base_info.date_info
					modelcard = await ctx.service.card.create( body.card.card.discount.base_info )
					let { discount } = body.card.card.discount
					modelupdates = { discount }
					break;
				case 'GIFT':
					body.card.card.gift.base_info.logo_url = material.url
					sku = body.card.card.gift.base_info.sku
					date_info = body.card.card.gift.base_info.date_info
					modelcard = await ctx.service.card.create( body.card.card.gift.base_info )
					let { gift } = body.card.card.gift
					modelupdates = { gift }
					break;
				case 'GENERAL_COUPON':
					body.card.card.general_coupon.base_info.logo_url = material.url
					sku = body.card.card.general_coupon.base_info.sku
					date_info = body.card.card.general_coupon.base_info.date_info
					modelcard = await ctx.service.card.create(body.card.card.general_coupon.base_info)
					let { default_detail } = body.card.card.general_coupon
					modelupdates = { default_detail }
					break;
			}
			await ctx.service.card.update( modelcard, modelupdates )
			const result = await ctx.service.wechat.createcard( filetype, body.card )
			const card_id = result.card_id;
			const { type, begin_timestamp, end_timestamp, fixed_term, fixed_begin_term } = date_info
			const { quantity } = sku
			let updates = { type, begin_timestamp, end_timestamp, fixed_term, fixed_begin_term, card_id, quantity }
			await ctx.service.card.update( modelcard, updates )
			ctx.body = 'result'
		}
		async createcardcode(){
			const { ctx } = this
			const form = {"action_name": "QR_CARD",
				"expire_seconds": 1800,
				"action_info": {
				"card": {
				"card_id": "plK740nSO1gVLtcVJwqMl2j3-Cm8",
				"code":"2392583481",
				"is_unique_code": false ,
				"outer_str":"12b"
			  	}
			 }
		}
		const result = await ctx.service.wechat.createqrcode(form)
		let token = await app.redis.get('publicaccesstoken')
		token = JSON.parse( token )
		const accessToken = token.accessToken
		const url = "https://api.weixin.qq.com/card/testwhitelist/set?access_token=" + accessToken
		const theform = {
			"openid": [
      			"okZUx1GaJimnEedgHlViTU6z9PSo",
               ],
		}
		const theresult = await request({url, method: 'POST', body: theform, json: true})
		console.log('theresult', theresult)
		ctx.body = result
		}
	}
}