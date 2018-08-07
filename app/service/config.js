module.exports=app=>{
	return class configservice extends app.Service{
		async findminibyname(){
			const { ctx } = this;
			const config  = await ctx.model.ModelConfig.findOne({where: {"type": "mini"}})
			return config
		}
		async findpublicbyname(){
			const { ctx } = this;
			const config = await ctx.model.ModelConfig.findOne({where: {"type": "public"}})
			return config
		}
	}
}