
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://admin:qwer127834!!@ds263138.mlab.com:63138/heroku_90w09qwl',
	db_schemas: [
	    {file:'./user_schema', collection:'users7', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./coffeeshop_schema', collection:'coffeeshop', schemaName:'CoffeeShopSchema', modelName:'CoffeeShopModel'}
        ,{file:'./shop_schema', collection:'shop', schemaName:'ShopSchema', modelName:'ShopModel'}
	],
	route_info: [
        //===== CoffeeShop =====//
	    {file:'./coffeeshop', path:'/process/addcoffeeshop', method:'add', type:'post'}	 
	    ,{file:'./coffeeshop', path:'/process/listcoffeeshop', method:'list', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/nearcoffeeshop', method:'findNear', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/withincoffeeshop', method:'findWithin', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/circlecoffeeshop', method:'findCircle', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/nearcoffeeshop2', method:'findNear2', type:'post'}
	    ,{file:'./coffeeshop', path:'/process/withincoffeeshop2', method:'findWithin2', type:'post'}
        //===== Shop =====//
	    ,{file:'./shop', path:'/process/addshop', method:'addShop', type:'post'}	 
	    ,{file:'./shop', path:'/process/listshop', method:'listShop', type:'post'}
        ,{file:'./shop', path:'/process/circleshop', method:'findCircle', type:'post'}
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