module.exports = app => {
	return class materialservice extends app.Service{
		async create( body ){
			const { ctx } = this;
			const { ModelMaterial } = ctx.model;
			console.log('----ModelMaterial----', ModelMaterial)
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const material = await ModelMaterial.create(body);
				await transaction.commit();
				return material;
			}catch(err){
				await transaction.rollback();
				return ctx.throw(404);
			}
		}
		async findmaterialbyid( id ){
			const { ctx } = this;
			const { ModelMaterial } = ctx.model;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const material = await ModelMaterial.findOne({where: {"id": id}},transaction);
				await transaction.commit();
				return material;
			}catch(err){
				await transaction.rollback();
				return ctx.throw(404);
			}
		}
		async update( material, updates ){
			const { ctx } = this;
			const transaction = await ctx.model.transaction({
				isolationLevel: app.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			});
			try{
				const result = await material.update(updates, {transaction});
				await transaction.commit();
				return result;
			}catch(err){
				await transaction.rollback();
				return ctx.throw(404);
			}
		}
	}
}

//$like :'%a' 已a结尾的模糊查询
//$like :'%a%' 含有a的模糊查询
//$like :'a%' 已a开头的模糊查询 