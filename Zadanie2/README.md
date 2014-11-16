#Jakub Karolczak

#Przygotowanie
Do tego zadania wykorzysta�em baz� GetGlue sample, zawieraj�c� 19.831.300 JSON�w. [�r�d�o](getglue-data.s3.amazonaws.com/getglue_sample.tar.gz).

Dane zaimportowa�em do bazy Mongo za pomoc� poni�szej komendy:

```time mongoimport --type json -d imdb -c imbd --file getglue_sample.json```

Czas wykonania operacji:

![import](http://i.imgur.com/s7vvLa7.png)

Aby upewni� si� czy na pewno wszystkie dane zosta�y zaimportowane, wykorzysta�em funkcj� count() w roboMongo:

![count](http://i.imgur.com/Rh0NO29.png)

#Agregacje