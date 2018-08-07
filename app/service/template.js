module.exports = app => {
	return class templateservice extends app.Service{
		async create( body ){
			const { ctx } = this
			const { ModelTemplate } = ctx.model
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try {
				const template = await ModelTemplate.create(body, {transaction})
				await transaction.commit()
				return template
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async findtemplatebyid ( id ) {
			const { ctx } = this
			const { ModelTemplate } = ctx.model
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try {
				const template = await ModelTemplate.findOne({ where: {'id': id}}, transaction)
				await transaction.commit()
				return template
			}catch(err) {
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async update( template, updates ){
			const { ctx } = this
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try{
				const result = await template.update(updates, {transaction})
				await transaction.commit()
				return result
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
	}
}