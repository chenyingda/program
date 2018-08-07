module.exports = app =>{
	return class keywordservice extends app.Service{
		async create( body ){
			const { ctx } = this;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const keyword = await ctx.model.ModelKeyword.create(body, {transaction})
				await transaction.commit()
				return keyword
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async findkeywordbyid( id ){
			const { ctx } = this;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const keyword = await ctx.model.ModelKeyword.findOne({where: {'id': id}}, transaction)
				await transaction.commit()
				return keyword
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async update( keyword, updates ){
			const { ctx } = this;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const result = await keyword.update(updates, {transaction})
				await transaction.commit()
				return result
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
	}
}