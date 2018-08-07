'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.all('/wechat', controller.wechat.index)

  router.post('/card/createcard', controller.card.createcard)

  router.get('/card/createcardcode', controller.card.createcardcode)

  router.post('/material/upload', controller.material.upload)

  router.post('/login/login', controller.login.login)
  router.post('/login/sign', controller.login.sign)
  router.post('/login/carddecode', controller.login.carddecode)
  router.get('/del', controller.login.del)
  router.post('/login/decodeencryptedData', controller.login.decodeencryptedData)

  router.post('/template/sendtemplate', controller.template.sendtemplate)

  router.post('/programpay/sendcoupon', controller.programpay.sendcoupon)
  router.get('/programpay/paynotify', controller.programpay.paynotify)
  router.post('/programpay/pay', controller.programpay.pay)
};
