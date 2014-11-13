/**
 * Created by Jakub on 2014-11-09.
 */

var Db = require('mongodb').Db
    , Server = require('mongodb').Server
    , MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';

//Moje zmienne:
var obiekty = 0;        //Ilosc obiektow w bazie
var tagIlosc = 0;       //Liczy wszystkie tagi
var tagi = {};          //Przechowuje rozne tagi
var rozne = 0;          //Liczy ilosc roznych tagow

var db = new Db('test', new Server('localhost', 27017));

db.open(function(err){
   if(err){
       console.log(err);
   }  else {
       console.log("Połączono z serwerem");

       db.collection('Train', function(err, collect){
          if(err){
              console.log(err);
              db.close();
          }  else {
              var cursor = collect.find();

              cursor.each(function(err, item){
                  if(err) {
                      console.log(err);
                      db.close();
                  } else if(item === null){
                      db.close();
                      console.log("Zakonczono dzialanie programu");
                      console.log("ilość obiektów: " + obiekty);
                      console.log("ilość tagów: " + tagIlosc);
                      console.log("różnych tagów: " + rozne);
                  } else {
                      obiekty++;

                      //Sprawdzam czy tagi są w formie tablicy
                      if(item.tags.constructor !== Array){
                          var tempTag= [];    //Przechowuje tagi rozdzielone ze stringa

                          if(item.tags.constructor === String) {
                              tempTag = item.tags.split(" "); //Rozdzielam tagi po spacji
                          } else {
                              tempTag.push(item.tags);
                          }

                          tagIlosc += tempTag.length; //Zwiekszam ilosc wszystkich tagow

                          for(i = 0; i < tempTag.length; i++){
                              //Jeśli napotykamy nowy tag
                              if(tagi[tempTag[i]] === undefined){
                                  tagi[tempTag[i]] = 1;    //Zaznaczam, że napotkałem taki tag pierwszy raz
                                  rozne++;    //Zwiekszam ilosc roznych tagow
                              } else {
                                  tagi[tempTag[i]]++; //Napotkałem dany tag kolejny raz
                              }
                          }

                          item.tags = tempTag;    //Zmieniam tagi w obiekcie na tablicę

                          //collect.update({_id:item._id}, {$set: {tags:item.tags}});
                          collect.save(item);   //Zapisuję w bazie
                      }

                  }

              });
          }
       });
   }
});
