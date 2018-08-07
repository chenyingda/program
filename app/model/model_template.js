const moment = require('moment')
module.exports = app => {
	const Datatypes = app.Sequelize
	const Model = app.model.define('model_template', {
		id: {
			type: Datatypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		template_id: Datatypes.STRING(256),
		openid: Datatypes.STRING(256),
		form_id: Datatypes.STRING(256),
		data: Datatypes.STRING(500),
		createtime: Datatypes.STRING(256),
		failuretime: Datatypes.STRING(256),
		type: {
			type: Datatypes.ENUM( '0', '1' ), //0代表还没有对该用户发送模板消息, 1代表已经发送过了
			defaultValue: '0'
		},
		created_at: {
			type: Datatypes.DATE,
			get () {
      			return moment(this.getDataValue( 'created_at' )).format( 'YYYY-MM-DD HH:mm:ss' )
      		}
		},
		updated_at: {
			type: Datatypes.DATE,
			get () {
				return moment(this.getDataValue( 'updated_at' )).format( 'YYYY-MM-DD HH:mm:ss' )
			}
		}
	},{
		tableName: 'template',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	})
	return Model
}