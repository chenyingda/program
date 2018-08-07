module.exports = app => {
	return class cardservice extends app.Service{
		async create( body ){
			const { ctx } = this;
			const { ModelCard } = ctx.model
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try{
				const card = await ModelCard.create( body, {transaction});
				await transaction.commit()
				return card
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async findcardbyid ( id ) {
			const { ctx } = this;
			const { ModelCard } = ctx.model
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try { 
				const card = await ModelCard.findOne({ where: {'id': id}}, transaction)
				await transaction.commit()
				return card
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async delete ( id ) {
			const { ctx } = this;
			const { ModelCard } = ctx.model
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try{
				const card = await ModelCard.findOne({where: {'id': id}}, transaction)
				const result = await card.destroy({ transaction })
				await transaction.commit()
				return result 
			}catch(err){ 
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
		async update ( card, updates ) {
			const { ctx } = this;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			})
			try {
				const result = await card.update(updates, {transaction})
				await transaction.commit() 
				return result			
			}catch(err){
				await transaction.rollback()
				return ctx.throw(404)
			}
		}
	}
}