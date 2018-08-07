const moment = require('moment')
module.exports = app => {
	const Datatypes = app.Sequelize
	const Model = app.model.define('material', {
		id: {
			type: Datatypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: Datatypes.STRING(50),
			allowNull: false
		},
		title: {
			type: Datatypes.STRING(225),
			allowNull: true
		},
		content: {
			type: Datatypes.TEXT,
			allowNull: true
		},
		media_id: {
			type: Datatypes.STRING(500),
			allowNull: false
		},
		url: {
			type: Datatypes.STRING(225),
			allowNull: true
		},
		linkurl: {
			type: Datatypes.STRING(500),
			allowNull: true
		},
		status_type: {
			type: Datatypes.ENUM('0', '1'), //0代表临时，1代表永久
			allowNull: false,
			defaultValue: '0'
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
	}, {
		tableName: 'material',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	})
	Model.associate = function(){
		app.model.ModelMaterial.belongsToMany(app.model.ModelKeyword, {
			foreignKey: 'materialid',
			as: 'keyword',
			through: 'keywordmaterial'
		})
	}
	return Model
}
