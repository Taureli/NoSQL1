#Jakub Karolczak

> Spis zadań:
> * [1a](#1a)
> * [1b](#1b)
> * [1c](#1c)
> * [1d](#1d)
>  - [Przygotowanie](#przygotowanie-1)
>  - [Zapytania](#zapytania)

###Sprzęt:
* Procesor Intel Core i3-2120 3.3GHz
* Dysk HDD
* 12 GB pamięci DDR III
* System Windows 8.1

#1a

####Przygotowanie
Przed zimportowaniem pliku Train.csv należy go przerobić za pomocą skryptu [2unix.sh](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1a/2unix.sh) uruchomionego poprzez Cygwina:

![konwersja](http://i.imgur.com/kBUl4oI.png)

####Importowanie pliku do bazy

Po wykonaniu konwersji, nowy plik należy zimportować do bazy Mongo, wpisując poniższą komendę w PowerShellu:

```Measure-Command {mongoimport --type csv -c Train --file .\TrainReady.csv --headerline}```

![import](http://i.imgur.com/uxscsgf.png)

#####Obserwacje:
W trakcie wykonywania operacji importowania danych ilość wykorzystywanej pamięci powoli i stale wzrastała:

![pamięć](http://i.imgur.com/7wlBKDK.png)

Zużycie dysku niemal przez cały czas wynosiło 100%, a zużycie procesora wahało się pomiędzy 0% a 45%:

![dyskCPU](http://i.imgur.com/aHgnFhd.png)

#1b
Zliczenie liczby zimportowanych obiektów w programie Robomongo:

![zliczenie](http://i.imgur.com/X838ehR.png)

#1c
Do zamiany i zliczenia tagów wykorzystałem [program napisany w języku JavaScript](https://github.com/Taureli/NoSQL1/blob/master/1c/tags.js).

![tagi](http://i.imgur.com/94szLaX.png)

#####Obserwacje:
Przez cały czas operacji programu zużycie pamięci powolnie wzrastało:

![pamięć2](http://i.imgur.com/xMBq535.png)

Zużycie dysku było niewielkie a procesora utrzymywało się w okolicy 40%. Co pewien czas w tym samym momencie zużycie dysku wzrastało do 100% a procesora spadało do zera:

![dyskCPU2](http://i.imgur.com/Ao41fLh.png)

#1d
###Przygotowanie
Do zadania wykorzystałem bazę z nazwami geograficznymi miejsc znajdujących się w stanie California. [Źródło](http://geonames.usgs.gov/domestic/download_data.htm).

Dane w bazie porozdzielane są znakami '|', które zamieniłem na przecinki za pomocą polecenia:

```cat CA_Features_20141005.txt | tr "|" "," > CAReady.txt```

Następnie zaimportowałem dane do bazy poleceniem:

```time mongoimport --type csv -c California --file .\CAReady.csv --headerline```

![import2](http://i.imgur.com/c50mNUp.png)

Kolejnym krokiem była zamiana wszystkich danych na GeoJSONy i przy okazji pozbycie się niektórych niepotrzebnych\błędnych informacji. Wykorzystałem do tego [prosty skrypt napisany w języku JavaScript](https://github.com/Taureli/NoSQL1/blob/master/1d/geojson-convert.js).

Skrypt uruchamiany jest poprzez polecenie:

```time mongo test geojson-converter.js```

![konwersja2](http://i.imgur.com/wcnPRs9.png)

Gotowe obiekty zawierają id, nazwę oraz współrzędne geograficzne:

```
{
    "id": FEATURE_ID,
    "name": FEATURE_NAME,
    "loc": { "type":"Point", "coordinates": [ PRIM_LONG_DEC , PRIM_LAT_DEC ] }
}
```

Ostatnim krokiem jest dodanie geo-indeksu:

```db.CaliforniaGeo.ensureIndex({"loc" : "2dsphere"})```

###Zapytania
####1 . Zapytanie z użyciem $near

```
var origin = { 
    "type" : "Point", 
    "coordinates" : [ -121.914125,  37.713263 ] 
};

db.CaliforniaGeo.find({ loc: {$near: {$geometry: origin, $maxDistance: 1000}} })
```

W wyniku zapytania zwrócono 9 rekordów.

[Mapka z wynikiem zapytań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/1near.geojson)

####2 . Zapytanie z użyciem $geoWtihin i $center

```
db.CaliforniaGeo.find({
  loc: {$geoWithin : { $center : [ [ -114.494115,  32.823100 ] , 0.1 ] } } 
}).forEach(function(dane){print(dane.loc);})
```

W wyniku zapytania zwrócono 26 rekordów.

[Mapka z wynikiem zapytań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/2geowithin.geojson)

####3 . Zapytanie z użyciem $near dla takich samych danych jak w podpunkcie 2.

```
var origin = { 
    "type" : "Point", 
    "coordinates" : [ -114.494115,  32.823100 ] 
};

db.CaliforniaGeo.find({ loc: {$near: {$geometry: origin, $maxDistance: 10000}} })
```

W wyniku zapytania zwrócono 25 rekordów.

[Mapka z wynikiem zapytań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/3near.geojson)

####4 . Zapytanie z użyciem $geoWithin w obszarze zdefiniowanym Polygonami

```
var region = { 
    "type" : "Polygon", 
    "coordinates" : 
    [ [ 
        [ -120.6 , 35 ], 
        [ -120.6 , 34.95 ], 
        [ -120.55 , 34.95    ], 
        [ -120.55 , 35    ], 
        [ -120.6 , 35 ] 
    ] ]
};

db.CaliforniaGeo.find({ loc : { $geoWithin : { $geometry : region } } })
```

W wyniku zapytania zwrócono 14 rekordów.

[Mapka obrazująca region poszukiwań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/4region.geojson)

[Mapka z wynikiem zapytań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/4geowithin.geojson)

####5 . Zapytanie z użyciem $geoIntersects w obszarze zdefiniowanym Polygonami, takim samym jak w podpunkcie 4.

```
var region = { 
    "type" : "Polygon", 
    "coordinates" : 
    [ [ 
        [ -120.6 , 35 ], 
        [ -120.6 , 34.95 ], 
        [ -120.55 , 34.95    ], 
        [ -120.55 , 35    ], 
        [ -120.6 , 35 ] 
    ] ]
};

db.CaliforniaGeo.find({ loc : { $geoIntersects : { $geometry : region } } }).forEach(function(dane){print(dane.loc);})
```

W wyniku zapytania zwrócono 14 rekordów.

[Mapka z wynikiem zapytań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/5geointersects.geojson)

####6 . Zapytanie z użyciem $geoIntersects na linii pomiędzy dwoma punktami

```
var line = { 
  "type": "LineString", 
  "coordinates": 
    [
      [ -122.56 , 37.5 ] , [ -122.35 , 37.55 ]
    ]
};

db.CaliforniaGeo.find({ loc : { $geoIntersects : { $geometry : line } } }).forEach(function(dane){print(dane.loc);})
```

Po kilkunastu próbach na różnych współrzędnych dla obu punktów, nie udało mi się znaleźć punktu przecinającego powstałą linię, więc w wyniku powyższego zapytania zwrócono 0 rekordów.

[Mapka obrazująca region poszukiwań](https://github.com/Taureli/NoSQL1/blob/master/Zadanie1/1d/geojsons/6line.geojson)
