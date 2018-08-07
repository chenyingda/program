const path = require('path')
const promise = require('bluebird')
const readfile = promise.promisify(require('fs').readFile)
const request = require('request-promise-native')
const fs = require('fs')
module.exports = app =>{
	return class materialcontroller extends app.Controller{
		//上传视频素材需要将源码ops中stream字段改为data
		async upload(){
			const { ctx } = this
			const createRule = {
				filepath: {
					type: "string",
					required: false
				},
				material: {
					type: 'enum',
					values: ['0', '1']
				},
				type: 'string',
				articles: {
					type: 'object',
					required: false
				}
			}
			ctx.validate(createRule)
			const body = ctx.request.body
			let result = ''
			const { filepath, material, type, articles } = body
			if( material === '1' ){
				switch(type){
					case 'image':
					case 'voice':
					case 'thumb':
					result = await ctx.service.wechat.uploadMaterial( filepath, type )
					break;
					case 'video':
					result = await ctx.service.wechat.uploadVideoMaterial( filepath, type )
					break;
					case 'news':
					result = await ctx.service.wechat.uploadNewsMaterial( type, articles )	
					break;	
				}
			}else{
				result = await ctx.service.wechat.uploadMedia( filepath, type )
			}
			ctx.body = result
		}
	}
}