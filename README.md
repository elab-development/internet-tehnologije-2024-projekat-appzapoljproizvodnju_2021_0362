# To-Mate-O

To-Mate-O je veb aplikacija namenjena praćenju i organizaciji procesa uzgoja paradajza.

Aplikacija omogućava korisnicima da vode evidenciju o svojim biljkama, planiraju aktivnosti pomoću kalendara, ostavljaju komentare i prate vremensku prognozu. Sistem podržava različite korisničke uloge i ograničava pristup određenim funkcionalnostima u zavisnosti od uloge korisnika.

## Funkcionalnosti

- registracija, login i logout korisnika
- upravljanje korisničkim nalogom
- dodavanje, izmena i brisanje biljaka
- evidencija više biljaka i različitih vrsta paradajza
- kreiranje i upravljanje aktivnostima
- dodavanje komentara
- kalendarski prikaz aktivnosti
- vremenska prognoza
- obaveštenja o budućim aktivnostima
- premium korisnički nalog
- administratorsko upravljanje korisnicima
- kontrola pristupa na osnovu korisničke uloge

## Korisničke uloge

Aplikacija podržava sledeće uloge:

- Guest
- User
- Premium
- Admin

Premium korisnicima omogućene su dodatne funkcionalnosti, kao što su pristup kalendaru i vremenskoj prognozi, dok administrator ima mogućnost uklanjanja korisnika sistema.

## Tehnologije

### Frontend

- React
- JavaScript / JSX
- CSS

### Backend

- Laravel 11
- Laravel Sanctum
- REST API

### Baza podataka

- MySQL

### Eksterni servisi

- Open-Meteo Geocoding API

### DevOps i dokumentacija

- Docker
- Docker Compose
- Git
- GitHub
- Swagger

## Arhitektura

Aplikacija je podeljena na tri glavna dela:

1. React frontend
2. Laravel REST API backend
3. MySQL baza podataka

Frontend komunicira sa Laravel backendom putem REST API zahteva u JSON formatu.

Laravel backend komunicira sa MySQL bazom podataka i eksternim Open-Meteo servisima.

## Pokretanje projekta pomoću Docker-a

Potrebno je imati instalirane:

- Docker
- Docker Compose
- Git

Zatim je potrebno klonirati GitHub repozitorijum:

- git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-appzapoljproizvodnju_2021_0362

Nakon toga je potrebno otvoriti folder u kom se dobijeni projekat nalazi i pokrenuti ga pomoću Docker Compose:

- docker compose up -d --build

Status pokrenutih kontejnera se može proveriti komandom:

- docker ps

Za zaustavljanje svih servisa koristi se komanda:

- docker compose down