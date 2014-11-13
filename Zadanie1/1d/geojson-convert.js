
var cursor = db.California.find();

cursor.forEach(function (item){
	var geo = {
		"id": item["FEATURE_ID"],
		"name": item["FEATURE_NAME"],
		"loc": { "type":"Point", "coordinates": [ item["PRIM_LONG_DEC"] , item["PRIM_LAT_DEC"] ] }
	};
	db.CaliforniaGeo.insert(geo);
});

var cursor2 = db.CaliforniaGeo.find();
var count = 0;

cursor2.forEach(function (item){
	if(item.loc.coordinates[0].constructor !== Number || item.loc.coordinates[1].constructor !== Number){
		db.CaliforniaGeo.remove(item);
		count++;
	}
});

print("Pominięte obiekty: " + count);