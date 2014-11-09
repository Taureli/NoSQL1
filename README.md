#Jakub Karolczak

###Sprzęt:
* Procesor Intel Core i3-2120 3.3GHz
* Dysk HDD
* 12 GB pamięci DDR III
* System Windows 8.1


####Przygotowanie
Przed zimportowaniem pliku Train.csv należy go przerobić za pomocą skryptu 2unix.sh uruchomionego poprzez Cygwina:

![konwersja](http://i.imgur.com/kBUl4oI.png)

###1a

Po wykonaniu konwersji, nowy plik należy zimportować do bazy Mongo, wpisując poniższą komendę w PowerShellu:
`Measure-Command {mongoimport --type csv -c Train --file .\TrainReady.csv --headerline}`

![import](http://i.imgur.com/uxscsgf.png)

W trakcie wykonywania operacji importowania danych ilość wykorzystywanej pamięci powoli i stale wzrastała:

![pamięć](http://i.imgur.com/7wlBKDK.png)

Zużycie dysku niemal przez cały czas wynosiło 100%, a zużycie procesora wahało się pomiędzy 0% a 45%:

![dyskCPU](http://i.imgur.com/aHgnFhd.png)

###1b
Zliczenie liczby zimportowanych obiektów w programie Robomongo:

![zliczenie](http://i.imgur.com/X838ehR.png)
