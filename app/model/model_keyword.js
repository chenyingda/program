const moment = require('moment')
module.exports = app=>{
	const Datatypes = app.Sequelize
	const Model = app.model.define('model_keyword', {
		id: {
			primaryKey: true,
			type: Datatypes.INTEGER(11),
			autoIncrement: true
		},
		keyword: {
			type: Datatypes.STRING(80),
			allowNull: true
		},
		type: {
			type: Datatypes.STRING(50),
			allowNull: true
		},
		event: {
			type: Datatypes.STRING(50),
			allowNull: true
		},
		created_at:{
			type: Datatypes.DATE,
			get(){
      			return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss')
      		}
		},
		updated_at:{
			type: Datatypes.DATE,
			get(){
				return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	},{
		tableName: 'keyword',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	})
	Model.associate = function(){
		app.model.ModelKeyword.belongsToMany(app.model.ModelMaterial, {
			foreignKey: 'keywordid',
			as: 'material',
			through: 'keywordmaterial'
		})
	}
	return Model
}