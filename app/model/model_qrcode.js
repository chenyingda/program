const moment = require('moment');
module.exports = app =>{
	const Datatypes = app.Sequelize;
	const Model = app.model.define('model_qrcode', {
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: Datatypes.INTEGER(11)
		},
		url: Datatypes.STRING(500),
		ticket: Datatypes.STRING(500),
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
		tableName: 'qrcode',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	});
	return Model;
}