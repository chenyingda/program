const WXBizDataCrypt = require('../util/WXBizDataCrypt.js')
const xml2js = require('xml2js')
module.exports = app => {
	return class utilservice extends app.Service{
		async getnonce () {
			let str = ''
			for(let i = 0; i < 30; i++){
				str+= Math.floor(Math.random()*10) 
			}
			return str
		}
		async sort ( form ) {
			let values = Object.values( form )
			values = values.sort()
			console.log('values', values)
			let str = ''
			for(let i = 0; i < values.length; i++){
				str+= values[i]
			}
			console.log('str', str)
			return str
		}
		async decodeencryptedData ( encryptedData, iv, sessionKey ) {
			const { ctx } = this
			const appid = app.config.miniprogram.appid
			const pc = new WXBizDataCrypt( appid, sessionKey )
			const data = pc.decryptData( encryptedData, iv )
			return data
		}
		async parsexml ( xml ) {
			return new Promise((resolve, reject)=>{
				xml2js.parseString(xml, {trim: true}, (err, content)=>{
					if( err ){
						reject( err )
					}else{
						resolve( content )
					}
				})
			})
		}
	}
}