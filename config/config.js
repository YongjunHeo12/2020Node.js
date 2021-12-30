/*
 * 설정
 */
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/R12_21',
	db_schemas: [
	    {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./umbrella_schema', collection:'umbrella', schemaName:'UmbrellaSchema', modelName:'UmbrellaModel'}
         ,{file:'./rental_schema', collection:'rental', schemaName:'RentalSchema', modelName:'RentalModel'}
	],
	route_info: [
	    {file:'./umbrella', path:'/process/addumbrella', method:'add', type:'post'}	 
	    ,{file:'./umbrella', path:'/process/listumbrella', method:'list', type:'post'}
	    ,{file:'./umbrella', path:'/process/circleumbrella', method:'findCircle', type:'post'}
	    ,{file:'./umbrella', path:'/process/nearumbrella2', method:'findNear2', type:'post'}
         ,{file:'./umbrella', path:'/process/rentalumbrella', method:'rentalumbrella', type:'post'}
        ,{file:'./umbrella', path:'/process/rentallist', method:'rentallist', type:'post'}
        
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	}
}
