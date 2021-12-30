var winston = require('winston');//외장모듈3개
var winstonDaily = require('winston-daily-rotate-file');
var moment = require('moment');

function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

var logger = new (winston.createLogger)({
    transports: [
        new (winstonDaily)({
            name:'info-file',
            filename:'./log/server',
            datePattern:'_YYYY-MM-DD',
            colorize:false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        }),
        new (winston.transports.Console)({
            name:'debug-console',
            colorize:true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: './log/exception',
            datePattern: '_YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});

var add = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 add 호출됨.');
    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    //var paramTel = req.body.tel || req.query.tel;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    console.log('요청 파라미터 : ' + paramName + ', ' + paramAddress + ', ' /*+
               paramTel + ', ' */+ paramLongitude + ', ' +
               paramLatitude);
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		addUmbrella(database, paramName, paramAddress, /*paramTel,*/ paramLongitude, paramLatitude, function(err, result) {
			if (err) {
                console.error('우산 대여소 추가 중 에러 발생 : ' + err.stack);
                logger.error(timeStampFormat() + ' 우산 대여소 추가 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (result) {
				console.dir(result);
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 추가 성공</h2>');
                res.write("<br><br><a href = '/profile'>프로필로 돌아가기</a>")
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 추가 실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
var list = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 list 호출됨.');
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 모든 우산 대여소 검색
		database.UmbrellaModel.findAll(function(err, results) {
			if (err) {
                console.error('우산 대여소 리스트 조회 중 에러 발생 : ' + err.stack);
                 logger.error(timeStampFormat() + ' 우산 대여소 리스트 조회 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 리스트 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (results) {
				console.dir(results);
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 리스트</h2>');
                res.write('<a href = "/profile">프로필로 돌아가기</a>')
				res.write('<div><ul>');
				for (var i = 0; i < results.length; i++) {
					var curName = results[i]._doc.name;
					var curAddress = results[i]._doc.address;
					//var curTel = results[i]._doc.tel;
					var curLongitude = results[i]._doc.geometry.coordinates[0];
					var curLatitude = results[i]._doc.geometry.coordinates[1];
					res.write('    <li>#' + i + ' : ' + curName + ', ' + curAddress + /*', ' + curTel +*/ ', ' + curLongitude + ', ' + curLatitude + '</li>');
				}	
				res.write('</ul></div>');
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 리스트 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
var findCircle = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 findCircle 호출됨.');
    var paramCenterLongitude = req.body.center_longitude || req.query.center_longitude;
    var paramCenterLatitude = req.body.center_latitude || req.query.center_latitude;
    var paramRadius = req.body.radius || req.query.radius;
    console.log('요청 파라미터 : ' + paramCenterLongitude + ', ' + paramCenterLatitude + ', ' + 
               paramRadius);
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 가까운 우산 대여소 검색
		database.UmbrellaModel.findCircle(paramCenterLongitude, paramCenterLatitude, paramRadius, function(err, results) {
			if (err) {
                console.error('우산 대여소 검색 중 에러 발생 : ' + err.stack);
                 logger.error(timeStampFormat() + ' 우산 대여소 검색 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 검색 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (results.length>0) {
				console.dir(results);
                res.render('circleumbrella.ejs', {result: results[0]._doc, paramLatitude: paramCenterLatitude, paramLongitude: paramCenterLongitude, paramRadius: paramRadius});
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>반경 내 우산 대여소 없음</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
// 우산 대여소을 추가하는 함수
var addUmbrella = function(database, name, address, /*tel, */longitude, latitude, callback) {
	console.log('addUmbrella 호출됨.');
	// UmbrellaModel 인스턴스 생성
	var Umbrella = new database.UmbrellaModel(
			{name:name, address:address, /*tel:tel,*/
			    geometry: {
				   type: 'Point',
				   coordinates: [longitude, latitude]
			    }
			}
		);
	// save()로 저장
	Umbrella.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
	    console.log("우산 대여소 데이터 추가함.");
	    callback(null, Umbrella);
	});
}
// 우산 대여현황을 추가하는 함수
var addRental = function(database, name, rentaltime, callback) {
	console.log('addRental 호출됨.');
	var Rental = new database.RentalModel(
			{
               name: name,
               rentaltime:rentaltime 
			}
		);
	// save()로 저장
	Rental.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
	    console.log("우산 대여현황 추가함.");
	    callback(null, Rental);
	});
}
var findNear2 = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 findNear2 호출됨.');
	var maxDistance = 1000;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    console.log('요청 파라미터 : ' + paramLongitude + ', ' + paramLatitude);
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 가까운 우산 대여소 검색
		database.UmbrellaModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results) {
			if (err) {
                console.error('우산 대여소 검색 중 에러 발생 : ' + err.stack);
                logger.error(timeStampFormat() + ' 우산 대여소 검색 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여소 검색 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (results) {
				console.dir(results);
				if (results.length > 0) {
					res.render('findnear.ejs', {result: results[0]._doc, paramLatitude: paramLatitude, paramLongitude: paramLongitude});
				} else {
					res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
					res.write('<h2>가까운 우산 대여소 데이터가 없습니다.</h2>');
					res.end();
				}
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>가까운 우산 대여소 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
var rentalumbrella = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 rentalumbrella 호출됨.');
    var paramrentalDatetime = req.body.rentaltime || req.query.rentaltime;
    var paramName = req.body.name || req.query.name;
	//렌탈할때 이름 이메일을 입력받지 않고 전에 로그인 했던 캐시정보를 토대로 우산 대여 정보에 넣기 
    console.log('요청 파라미터 : ' + paramrentalDatetime + ', ' + paramName );
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
        console.log('들어옴1');
		// 1. 가까운 우산 대여소 검색
	addRental(database, paramName,  paramrentalDatetime, function(err, result) {
			if (err) {
                console.error('우산 대여 중 에러 발생 : ' + err.stack);
                logger.error(timeStampFormat() + ' 우산 대여 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (result) {
				console.dir(result);
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 성공</h2>');
                res.write('<br><br><a href = "/profile">프로필로 돌아가기</a>');
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
var rentallist = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 rentallist 호출됨.');
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 가까운 우산 대여소 검색
		database.RentalModel.findAll(function(err, results) {
			if (err) {
                console.error('대여 현황 검색 중 에러 발생 : ' + err.stack);
                logger.error(timeStampFormat() + ' 대여 현황 검색 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (results.length>0) {
				console.dir(results);
                var paramrentalDatetime = results[0]._doc.rentaltime;
                var paramName = results[0]._doc.name;
                console.log(paramrentalDatetime + paramName);
                res.render('rental.ejs', { paramrentalDatetime: paramrentalDatetime, paramName: paramName,
                });
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 현황 없음</h2>');
                 res.write('<br><br><a href = "/profile">프로필로 돌아가기</a>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
var returnumbrella = function(req, res) {
	console.log('Umbrella 모듈 안에 있는 returnumbrella 호출됨.');
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
        console.log('들어옴1');
		// 1. 가까운 우산 대여소 검색
		database.RentalModel.findAll(function(err, results) {
			if (err) {
                console.error('우산 반납 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
				res.write('<h2>우산 대여 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                return;
            }
			if (results.length>0) {
                console.log('들어옴');
				console.dir(results);
                var paramrentalDatetime = results[0]._doc.rentaltime;
                var paramName = results[0]._doc.name;
                console.log(paramrentalDatetime + paramName);
                res.render('rental.ejs', { paramrentalDatetime: paramrentalDatetime, paramName: paramName,
                });
			} 
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=UTF-8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
};
module.exports.add = add;
module.exports.list = list;
module.exports.findCircle = findCircle;
module.exports.findNear2 = findNear2;
module.exports.rentalumbrella = rentalumbrella;
module.exports.rentallist = rentallist;
module.exports.returnumbrella = returnumbrella;
