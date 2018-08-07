module.exports=app=>{
	return class templatecontroller extends app.Controller{
		async sendtemplate(){
			const {ctx} = this;
			const createRule = {
				"form_id": "string",
				"token": "string"
			};
			ctx.validate(createRule);
			const body = ctx.request.body;
			let { form_id, token } = body;
			console.log('form_id', form_id)
			token = await ctx.service.jwt.verify(token);
			const touser = token.openid
			const openid = token.openid
			const template_id = 'BgbABmMtv4NSB1MLqfw-PzL9VM1M-hA4lpj6ELH5dLs'
			let data = { 
				"keyword1" : {
					"value" : "2016年8月8日"
				},
				"keyword2" : {
					"value" : "银行转账"
				},
				"keyword3" : {
					"value" : "100元"
				},
				"keyword4" : {
					"value" : "财付通"
				},
				"keyword5" : {
					"value" : "咖啡"
				},
				"keyword6" : {
					"value" : "200元"
				},
				"keyword7" : {
					"value" : "300.00元92号油（2号枪）"
				},
				"keyword8" : {
					"value" : "1231313000929211111"
				}
			};
			console.log('22222222222222222222222222222')
			setTimeout(async ()=>{
				data = JSON.parse( data )
				await ctx.service.program.sendtemplate(touser, template_id, form_id, data)
			}, 10000)
			const Person = {
			    'name': 'little bear',
			    'age': 18,
			    'sayHello': function () {
			    	console.log(this.ctx)
			      	console.log('我叫' + this.name + '我今年' + this.age + '岁!')
			      }
		  		}
 			Person.sayHello()
			const createtime = new Date().getTime()
			const failuretime = createtime + (7200-10)*24*1000*7
			data = JSON.stringify( data )
			const createtemplate = { data, createtime, failuretime, template_id, form_id, openid }
			const template = await ctx.service.template.create( createtemplate ) 
			console.log('33333333333333333333333333333')
			ctx.body='zzzz'
		}
	}
}

