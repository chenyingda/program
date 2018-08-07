const request = require('request-promise-native')
module.exports = app=> {
	return class wehchatservice extends app.Service{
		async index( message ){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			return {
				type: 'text',
				content: 'aaaaa'
			}	
		}

		//上传永久素材,类型图片,缩略图,语音
		async uploadMaterial( filepath , type ){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			let result = await api.uploadMaterial( filepath , type );
			result = result.toString()
			result = JSON.parse(result) 
			result.type = type
			result.filepath = filepath
			result.status_type = "1"
			const material = await ctx.service.material.create( result );
			return material;
		}	

		//上传临时素材，类型有 图片 缩略图 视频 语音
		async uploadMedia( filepath, type ){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			let result = await api.uploadMedia( filepath, type )
			result = result.toString()
			result = JSON.parse(result) 
			result.type = type
			result.filepath = filepath
			const material = await ctx.service.material.create( result );
			return material;
		}

		//上传永久视频素材
		async uploadVideoMaterial( filepath,description ){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const type = 'video'
			let result = await api.uploadVideoMaterial( filepath, description);
			result = result.toString()
			result = JSON.parse(result)
			result.type = type
			console.log('this is result', result)
			const material = await ctx.service.material.create( result );
			const body = {}
			body.url = filepath
			body.status_type = "1"
			await ctx.service.material.update( material, body );
			return material;
		}

		//通过mediaid获取临时素材
		async getMedia(media_id){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const material = api.getMedia( media_id );
			return material
		}

		//上传永久图文素材
		async uploadNewsMaterial( type, articles ){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			console.log('-------------articles-----------', articles)
			let result = await api.uploadNewsMaterial(articles)
			result = result.toString()
			result = JSON.parse(result)
			console.log('-----------result---------', result)
			let newarticles = articles.articles
			for(let i in newarticles){
				let form = {}
				form.type = "news"
				form.media_id = result.media_id
				form.status_type = "1"
				form.linkurl = newarticles[i].content
				await ctx.service.material.create(form)
			}
			return result
		}

		//通过mediaid获取永久素材
		async getMaterial(media_id){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const material = api.getMaterial(media_id);
			return material;
		}

		//通过mediaid删除永久素材
		async removeMaterial(media_id){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const result = await ctx.service.wxapi.removeMaterial()
			return result
		}

		//获取永久素材总数
		async getMaterialCount(){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const result = await api.getMaterialCount();
			return result; 
		}

		//获取永久素材列表
		async getMaterials(){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index();
			const result = await api.getMaterials();
			return result; 
		}

		//创建微信卡券	
		async createcard( type, form ){
			const { ctx } = this
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken');
			console.log('------token------', token)
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = 'https://api.weixin.qq.com/card/create?access_token=' + accessToken;
			const result = await request({url, method: 'POST', body: form, json: true})
			console.log('this is result', result)
			return result
		}

		//创建卡券二维码,调用接口与api二维码接口不同
		async createqrcode(form){
			const { ctx } = this;
			const { ModelQrcode } = ctx.model
			const api = await ctx.service.wxapi.index();
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken')
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = 'https://api.weixin.qq.com/card/qrcode/create?access_token=' + accessToken; 
			const result = await request({url, method: 'POST', body: form, json:true})
			const ticket = result.ticket
			const newurl = await api.showQRCodeURL(ticket)
			const createqrcode = { ticket }
			createqrcode.url = newurl
			const qrcode = await ModelQrcode.create(createqrcode)
			return qrcode
		}
		async getapiticket(){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get( 'publicaccesstoken' )
			token = JSON.parse(token)
			const accessToken = token.accessToken
			let apiticket = await app.redis.get('apiticket');
			if( apiticket!=null && apiticket!=undefined ){
				apiticket = JSON.parse( apiticket )
				const { ticket, expiresin } = apiticket;
				if(expiresin < new Date().getTime() ){
					await this.updateapiticket()
				}
			}else{
				await this.updateapiticket()
			}
			apiticket = await app.redis.get('apiticket')
			apiticket = JSON.parse( apiticket )
			apiticket = apiticket.ticket
			return apiticket
		}
		async updateapiticket(){
			const { ctx } = this;
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get( 'publicaccesstoken' )
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=wx_card";
			let result = await request({url, method: "GET", json: true})
			console.log("-------result-------------", result)
			const { ticket, expiresin } = result
			let form = {
				ticket: ticket,
				expiresin: new Date().getTime() + (7200-20)*1000 
			}
			form = JSON.stringify( form )
			await app.redis.set('apiticket', form)
		}
		async getjsapiticket(){
			const { ctx } = this;
			let jsapiticket = app.redis.get('jsapiticket')
			if( jsapiticket!=null && jsapiticket!=undefined ){
				jsapiticket = JSON.parse( jsapiticket )
				const { ticket, expiresin } = jsapiticket;
				if( expiresin < new Date().getTime()){
					await this.updatejsapiticket()
				}
			}else{
				await this.updatejsapiticket()
			}
			jsapiticket = await app.redis.get('jsapiticket')
			jsapiticket = JSON.parse( jsapiticket )
			jsapiticket = jsapiticket.ticket
			return jsapiticket 
		}
		async updatejsapiticket(){
			const { ctx } =  this;
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken')
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi"
			const jsapiticket = await request({url, method: 'GET', json: true})
			const { ticket, expires_in } = jsapiticket
			let form = {}
			form.ticket = ticket
			form.expiresin = new Date().getTime + (7200-20)*1000
			form = JSON.stringify( form )
			await app.redis.set( "jsapiticket", form )
		}
		async getuserlist(){
			const { ctx } =  this;
			const api = await ctx.service.wxapi.index()
			const apivalid = await api.ensureAccessToken()
			let token = await app.redis.get('publicaccesstoken')
			token = JSON.parse(token)
			const accessToken = token.accessToken
			const url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + accessToken + "&next_openid="
			const result = await request({ url, method: 'GET', json: true})
			return result 
		}
	}
}