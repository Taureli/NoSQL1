var coll = db.short;

printjson(coll.aggregate(
        { $match: {"modelName": "tv_shows"  } },
        { $group: {_id: "$title", count: {$sum: 1}} },
        { $sort: {count: -1} },
        { $limit : 10}
    ));
	
printjson(coll.aggregate(
           { $match: { "action": "Comment", "modelName": "movies" }},
           { $group: { _id: "$title", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ));
	   
printjson(coll.aggregate(
           { $match: { "action": "Liked" }},
           { $group: { _id: "$title", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
        ));
		
printjson(coll.aggregate(
           { $match: { "action": "Liked" }},
           { $group: { _id: "$userId", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ));
	   
printjson(coll.aggregate(
           { $match: { "action": "Disliked" }},
           { $group: { _id: "$director", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ));