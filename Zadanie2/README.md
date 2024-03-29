#Jakub Karolczak

> Spis zadań:
> * [Przygotowanie](#przygotowanie)
> * [Agregacje](#agregacje)
>  * [Najpopularniejsze seriale](#1-najpopularniejsze-seriale)
>  * [Najczęściej komentowane filmy](#2-najczęściej-komentowane-filmy)
>  * [Najlepsze tytuły](#3-najlepsze-tytuły)
>  * [Użytkownicy, którzy najwięcej lubią](#4-użytkownicy-którzy-najwięcej-lubią)
>  * [Reżyserzy znielubianych filmów](#5-reżyserzy-znielubianych-filmów)


#Przygotowanie
Do tego zadania wykorzystałem bazę GetGlue sample, zawierającą 19.831.300 JSONów. [Źródło](getglue-data.s3.amazonaws.com/getglue_sample.tar.gz).

Dane zaimportowałem do bazy Mongo za pomocą poniższej komendy:

```time mongoimport --type json -d imdb -c imbd --file getglue_sample.json```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|41m 23s|
|2.8.0-rc0|40m 46s|
|2.8.0-rc1 + wiredTiger|19m 35s|

Aby upewnić się czy na pewno wszystkie dane zostały zaimportowane, wykorzystałem funkcję count() w roboMongo:

![count](http://i.imgur.com/Rh0NO29.png)

#Agregacje
Kody programów z agregacjami: 
* [Node.js](AggregJS/AggregJS.js)
* [Mongo Shell](AggregShell/AggregShell.js)

Kody zamieszczone w poniższej dokumentacji napisane zostały przy użyciu Node.js.

###1. Najpopularniejsze seriale
Wypisuje 10 seriali, których tytuły najczęściej pojawiały się w bazie.

Kod z zapytaniem:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/imdb", function(err, db){

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
	
}
```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|6m 28s|
|2.8.0-rc0|6m 34s|
|2.8.0-rc1 + wiredTiger|12m 22s|

Wynik:

```
 1 - Najpopularniejsze seriale (Najczęściej pojawiające się)
[ { _id: 'The Big Bang Theory', count: 260686 },
  { _id: 'Fringe', count: 187910 },
  { _id: 'Nikita', count: 150683 },
  { _id: 'Glee', count: 146799 },
  { _id: 'Supernatural', count: 130454 },
  { _id: 'True Blood', count: 122913 },
  { _id: 'The Walking Dead', count: 119369 },
  { _id: 'The Vampire Diaries', count: 118000 },
  { _id: 'Game of Thrones', count: 108548 },
  { _id: 'Once Upon a Time', count: 99515 } ]
```

Wykres:

![wyk1](http://i.imgur.com/VPDI5kU.png)

###2. Najczęściej komentowane filmy
Wypisuje 10 filmów z największą ilością komentarzy.

Kod z zapytaniem:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/imdb", function(err, db){

	var coll = db.collection('imbd');

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
	
}
```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|5m 57s|
|2.8.0-rc0|5m 51s|
|2.8.0-rc1 + wiredTiger|12m 5s|

Wynik:

```
 2 - Filmy z największą ilością komentarzy
[ { _id: 'Slumdog Millionaire', count: 26 },
  { _id: 'Harry Potter and the Deathly Hallows: Part II', count: 13 },
  { _id: 'Avatar', count: 10 },
  { _id: 'The Dark Knight', count: 9 },
  { _id: 'Red Riding Hood', count: 8 },
  { _id: 'Bad Teacher', count: 8 },
  { _id: 'Priest', count: 7 },
  { _id: 'Apollo 18', count: 7 },
  { _id: 'Super 8', count: 7 },
  { _id: 'The Smurfs', count: 6 } ]
```

Wykres:

![wyk2](http://i.imgur.com/zSPxjzN.png)

###3. Najlepsze tytuły
Wypisuje 10 filmów/seriali z największą ilością polubień.

Kod z zapytaniem:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/imdb", function(err, db){

	var coll = db.collection('imbd');

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
	
}
```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|5m 55s|
|2.8.0-rc0|5m 49s|
|2.8.0-rc1 + wiredTiger|11m 45s|

Wynik:

```
 3 - Najlepsze filmy/seriale (Z największą ilością polubień)
[ { _id: 'The Big Bang Theory', count: 29757 },
  { _id: 'The Simpsons', count: 28297 },
  { _id: 'Family Guy', count: 28120 },
  { _id: 'House', count: 25866 },
  { _id: 'Glee', count: 22562 },
  { _id: 'How I Met Your Mother', count: 20854 },
  { _id: 'The Walking Dead', count: 20661 },
  { _id: 'Dexter', count: 19977 },
  { _id: 'True Blood', count: 19073 },
  { _id: 'The Hangover', count: 18631 } ]
```

Wykres:

![wyk3](http://i.imgur.com/1eGAgyt.png)

###4. Użytkownicy, którzy najwięcej lubią
Wypisuje 10 użytkowników z największą ilością rozdanych polubień.

Kod z zapytaniem:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/imdb", function(err, db){

	var coll = db.collection('imbd');

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
	
}
```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|5m 58s|
|2.8.0-rc0|5m 53s|
|2.8.0-rc1 + wiredTiger|12m 46s|

Wynik:

```
 4 - Użytkownicy z największą ilością rozdanych polubień
[ { _id: 'jesusvarelaacosta', count: 13562 },
  { _id: 'gluemanblues', count: 12932 },
  { _id: 'johnnym2001', count: 11436 },
  { _id: 'bangwid', count: 9237 },
  { _id: 'zenofmac', count: 9171 },
  { _id: 'statejcp', count: 8598 },
  { _id: 'brownbagcomics', count: 8150 },
  { _id: 'carla_moraglia', count: 7785 },
  { _id: 'LukeWilliamss', count: 7484 },
  { _id: 'kevinjloria', count: 7436 } ]
```

Wykres:

![wyk4](http://i.imgur.com/8ELa9h8.png)

###5. Reżyserzy znielubianych filmów
Wypisuje 10 reżyserów, których produkcje otrzymały najwięcej znielubień.

Kod z zapytaniem:

```JavaScript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/imdb", function(err, db){

	var coll = db.collection('imbd');

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
```

######Czasy wykonywania:
|Wersja | Czas|
|:-----:|:---:|
|2.6.5|6m 0s|
|2.8.0-rc0|5m 50s|
|2.8.0-rc1 + wiredTiger|13m 36s|
**2.6.5:**      6m 0s

**2.8.0-rc0:**  5m 50s

Wynik:

```
 5 - Reżyserzy, których produkcje otrzymały najwięcej znielubień
[ { _id: null, count: 209868 },
  { _id: 'steven spielberg', count: 3427 },
  { _id: 'tim burton', count: 3229 },
  { _id: 'james cameron', count: 2975 },
  { _id: 'sam raimi', count: 2319 },
  { _id: 'martin scorsese', count: 2201 },
  { _id: 'robert zemeckis', count: 1993 },
  { _id: 'michael bay', count: 1852 },
  { _id: 'roland emmerich', count: 1755 },
  { _id: 'ron howard', count: 1748 } ]
```

Wykres (z pominiętą wartością 'null'):

![wyk5](http://i.imgur.com/IlxLYuy.png)


---
> Wykresy wygenerowane za pomocą strony http://www.onlinecharttool.com
