/**
 * Created by Jakub on 2014-11-17.
 */

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb:localhost:27017/imdb", function(err, db){
   if(err){
       console.log(err);
   } else {
       console.log("Połączono z serwerem");

       var coll = db.collection('imbd');

       coll.aggregate([
           { $match: {"modelName": "tv_shows"  } },
           { $group: {_id: "$title", count: {$sum: 1}} },
           { $sort: {count: -1} },
           { $limit : 10}
       ], function(err, result){
           console.log("\n 1 - Najpopularniejsze seriale (Najczęściej pojawiające się)");
           console.log(result);
           db.close();
       });

       coll.aggregate([
           { $match: { "action": "Comment", "modelName": "movies" }},
           { $group: { _id: "$title", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ], function(err, result){
           console.log("\n 2 - Filmy z największą ilością komentarzy");
           console.log(result);
           db.close();
       });
       
       coll.aggregate([
           { $match: { "action": "Liked" }},
           { $group: { _id: "$title", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
        ], function(err, result){
           console.log("\n 3 - Najlepsze filmy/seriale (Z największą ilością polubień)");
           console.log(result);
           db.close();
       });
       
       coll.aggregate([
           { $match: { "action": "Liked" }},
           { $group: { _id: "$userId", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ], function(err, result){
           console.log("\n 4 - Użytkownicy z największą ilością rozdanych polubień");
           console.log(result);
           db.close();
       });
       
       coll.aggregate([
           { $match: { "action": "Disliked" }},
           { $group: { _id: "$director", count: {$sum: 1} } },
           { $sort: { count: -1 } },
           { $limit: 10 }
       ], function(err, result){
           console.log("\n 5 - Reżyserzy, których produkcje otrzymały najwięcej znielubień");
           console.log(result);
           db.close();
       });

   }
});