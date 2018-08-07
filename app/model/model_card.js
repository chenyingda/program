const moment = require('moment')
module.exports = app=> {
	const Datatypes = app.Sequelize
	const Model = app.model.define('model_card', {
		id: {
			type: Datatypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		card_id: Datatypes.STRING(256),
		card_type: Datatypes.ENUM( 'GROUPON', 'CASH', 'DISCOUNT', 'GIFT', 'GENERAL_COUPON' ),
		//以此代表团购券（deal_detail 团购券专用填写团购详情）
		// 代金券（least_cost 起用金额 为分 reduce_cost 减免金额 为分）  折扣券（discount 百分比 填30就代表七成）
		//兑换券（gift 填写兑换内容名称）优惠券（default_detail 优惠券专用 填写优惠详情）
		logo_url: Datatypes.STRING(256), //logo
		brand_name: Datatypes.STRING(50), //商户名
		code_type: Datatypes.ENUM('CODE_TYPE_QRCODE', 'CODE_TYPE_BARCODE', 'CODE_TYPE_ONLY_QRCODE', 'CODE_TYPE_TEXT', 'CODE_TYPE_NONE' ),
		title: Datatypes.STRING(50), //卡券名
		color: Datatypes.STRING(50), //颜色
		notice: Datatypes.STRING(50), //卡券使用提醒
		description: Datatypes.STRING(50), //卡券使用说明
		quantity: Datatypes.INTEGER(11), //卡券库存的数量
		type: Datatypes.ENUM( 'DATE_TYPE_FIX _TIME_RANGE', 'DATE_TYPE_FIX_TERM' ), //以此代表卡券时间区间, 卡券固定时长
		begin_timestamp: Datatypes.INTEGER(11).UNSIGNED, //起始时间
		end_timestamp: Datatypes.INTEGER(11).UNSIGNED,	//结束时间
		fixed_term: Datatypes.INTEGER(11), //自领取后多少天内有效
		fixed_begin_term: Datatypes.INTEGER(11), //自领取后多少天开始生效
		deal_detail: Datatypes.STRING(500), //团购详情
		discount: Datatypes.INTEGER(11), //折扣详情
		gift: Datatypes.STRING(256), //兑换详情
		default_detail: Datatypes.STRING(256), //优惠详情
		least_cost: Datatypes.INTEGER(11), //代金起用门槛
		reduce_cost: Datatypes.INTEGER(11), //代金减免金额
		get_limit: Datatypes.INTEGER(11),
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
		tableName: 'card',
		paranoid: true,
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	})
	return Model
}