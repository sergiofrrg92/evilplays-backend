# Evilplays Backend

## EvilPlays

Welcome to our new videgame catalog!. Feel free to login with your account (mocked for now) and add games to your gallery :). Once added you can add how many hours you invested in them!! Feel free to click on the hours invested to modify them and see how the number at the bottom grows.

You truly are a true gamer :).

## API Doc.

### URL: https://api.evilplays.students.nomoredomainssbs.ru/

#### Without Auth

- **Sign up** POST https://api.evilplays.students.nomoredomainssbs.ru/signup

  ```
  {
    "email":"test3@test.com",
    "password":"xxx",
    "name":"Prac Ticum",
    "games":[
        id1, id2...
    ]
  }

- **Sign in** POST https://api.evilplays.students.nomoredomainssbs.ru/signup

  ```
  {
    "email":"test3@test.com",
    "password":"xxx",
  }

#### With Auth (Headers: Authorization: Bearer <token>)
- **Get Users** Get https://api.evilplays.students.nomoredomainssbs.ru/users



- **Create Game** POST https://api.evilplays.students.nomoredomainssbs.ru/games

  ```
         {
            "name":"The Outer Wilds 2",
            "released":"2019-05-29",
            "image" : "https://www.mobygames.com/images/covers/l/599729-outer-wilds-playstation-4-front-cover.jpg",
            "rating" : 5,
            "description" : "Outer Wilds is an action-adventure game developed by M",
            "hoursPlayed": 5
        }

- **Get Games** GET https://api.evilplays.students.nomoredomainssbs.ru/games

- **Delete Game** DELETE https://api.evilplays.students.nomoredomainssbs.ru/games/:id



