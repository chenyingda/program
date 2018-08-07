module.exports=app=>{
	return class jwtservice extends app.Service{
		async sign(openid){
			const token = await app.jwt.sign({openid: openid},'cyd');
			return token
		}
		async verify(token){
			token = await app.jwt.verify(token, 'cyd');
			return token
		}
	}
}