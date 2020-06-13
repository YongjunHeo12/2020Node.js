
var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var rentalSchema= mongoose.Schema({
	     name: {type: String, index: 'hashed', 'default':''},
	    rentaltime: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	// 스키마에 static 메소드 추가
	// 모든 대여 내역 조회
	rentalSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	/* 뭐할지 생각좀
	rentalSchema.static('findNear', function(longitude, latitude, maxDistance, callback) {
		console.log('rentalSchema의 findNear 호출됨.');

		this.find().where('geometry').near({center:{type:'Point', coordinates:[parseFloat(longitude), parseFloat(latitude)]}, maxDistance:maxDistance}).limit(1).exec(callback);
	});
	*/
	console.log('rentalSchema정의함.');

	return rentalSchema;
};

// module.exports에 rentalSchema 객체 직접 할당
module.exports = Schema;

