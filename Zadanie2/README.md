#Jakub Karolczak

#Przygotowanie
Do tego zadania wykorzysta≥em bazÍ GetGlue sample, zawierajπcπ 19.831.300 JSONÛw. [èrÛd≥o](getglue-data.s3.amazonaws.com/getglue_sample.tar.gz).

Dane zaimportowa≥em do bazy Mongo za pomocπ poniøszej komendy:

```time mongoimport --type json -d imdb -c imbd --file getglue_sample.json```

Czas wykonania operacji:

![import](http://i.imgur.com/s7vvLa7.png)

Aby upewniÊ siÍ czy na pewno wszystkie dane zosta≥y zaimportowane, wykorzysta≥em funkcjÍ count() w roboMongo:

![count](http://i.imgur.com/Rh0NO29.png)

#Agregacje