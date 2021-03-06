

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var UmbrellaSchema= mongoose.Schema({
	    name: {type: String, index: 'hashed', 'default':''},
	    address: {type: String, 'default':''},
	    //tel: {type: String, 'default':''},
	    geometry: {
	    	'type': {type: String, 'default': "Point"},
	    	coordinates: [{type: "Number"}]
	    },
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	UmbrellaSchema.index({geometry:'2dsphere'});

	// 스키마에 static 메소드 추가
	// 모든 커피숍 조회
	UmbrellaSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	// 가장 가까운 커피숍 조회
	UmbrellaSchema.static('findNear', function(longitude, latitude, maxDistance, callback) {
		console.log('UmbrellaSchema의 findNear 호출됨.');

		this.find().where('geometry').near({center:{type:'Point', coordinates:[parseFloat(longitude), parseFloat(latitude)]}, maxDistance:maxDistance}).limit(1).exec(callback);
	});
	
	// 일정 반경 내의 커피숍 조회
	UmbrellaSchema.static('findCircle', function(center_longitude, center_latitude, radius, callback) {
		console.log('UmbrellaSchema의 findCircle 호출됨.');
		
		// change radian : 1/6371 -> 1km
		this.find().where('geometry').within({center:[parseFloat(center_longitude), parseFloat(center_latitude)], radius: parseFloat(radius/6371000), unique: true, spherical: true}).exec(callback);
	});
	
	console.log('umbrella_scheam정의함.');

	return UmbrellaSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

