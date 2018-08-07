const moment = require('moment')
module.exports=app=>{
	const Datatypes = app.Sequelize
	const Model = app.model.define('model_config', {
		id: {
			type: Datatypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: Datatypes.ENUM('public', 'mini')
		},
		appid: Datatypes.STRING(256),
		appsecret: Datatypes.STRING(256),
		token: Datatypes.STRING(32),
		encodingaeskey: Datatypes.STRING(256),
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
		tableName: 'config',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	})

	//prototype是为实例化的对象添加的属性
	/*Model.prototype.delete=async function(){

	}*/

	//
	/*Model.delete = async function(){
		return this.destroy({
			where :{
				id:{
					'$gte': 0
				}
			}
		})
	}*/
	return Model
}