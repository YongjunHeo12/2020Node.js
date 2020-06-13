/*
 * 설정
 */
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://admin:qwer127834!!@ds263138.mlab.com:63138/heroku_90w09qwl',
	db_schemas: [
	    {file:'./user_schema', collection:'users7', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./umbrella_schema', collection:'umbrella', schemaName:'UmbrellaSchema', modelName:'UmbrellaModel'}
	],
	route_info: [
        //===== CoffeeShop =====//
	    {file:'./umbrella', path:'/process/addumbrella', method:'add', type:'post'}	 
	    ,{file:'./umbrella', path:'/process/listumbrella', method:'list', type:'post'}
	    ,{file:'./umbrella', path:'/process/circleumbrella', method:'findCircle', type:'post'}
	    ,{file:'./umbrella', path:'/process/nearumbrella2', method:'findNear2', type:'post'}
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}