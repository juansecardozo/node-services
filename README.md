# Node.js Challenge

## How to run the project
***
Run the next commands in order to start the services:
1. `cp .env.sample .env`
2. `docker-compose up -d`

Now, `api-service` will be running on your local port `3000` and `stock-service` will be running on your local port `3001`.

## API Service
***
### Register new user
`POST /auth/register`

Body parameters
```json
{
    "email": "mail@example.com",
    "password": "mySecurePassword",
    "role": "admin" | "user"
}
```
Response example
```json
{
    "email": "mail@example.com",
    "role": "admin" | "user"
}
```
### Login
`POST /auth/login`

Body parameters
```json
{
    "email": "mail@example.com",
    "password": "mySecurePassword"
}
```
Response example
```json
{
    "token": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxOWM1MDMyLWIzN2QtNDU5ZC1iZTY5LTIzNWFlNTNmMjAzZCIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTY3Mzg4MDc0MCwiZXhwIjoxNjczOTY3MTQwfQ.IQeS_VSO0lbBkZzNCvFZvbnSDTnCOKiQzG5OSRPN7WE",
        "expiresIn": 86400,
        "tokenType": "Bearer",
        "roles": [
            "admin"
        ]
    },
    "user": {
      "email": "mail@example.com"
    }
}
```
## Get stock
`GET /stock?stock_code=${myStockCode}`

Headers
```json
{
  Authorization: "Bearer ${myAccessToken}"
}
```
Use `accessToken` value, obtained from login response.

Response example
```json
{
    "name": "STOCK NAME",
    "symbol": "STOCK.SYMBOL",
    "open": 2.35,
    "high": 2.35,
    "low": 2.34,
    "close": 2.345
}
```
## Get stock history
`GET /stock/history?limit=${maxResultsPerQuery}&page=${numberOfPage}`

Headers
```json
{
    Authorization: "Bearer ${myAccessToken}"
}
```
Use `accessToken` value, obtained from login response.

Response example
```json
{
  "data": [
    {
      "name": "STOCK NAME",
      "symbol": "STOCK.SYMBOL",
      "open": 2.35,
      "high": 2.35,
      "low": 2.34,
      "close": 2.345
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 25,
    "page": 1,
    "pages": 1
  }
}
```
## Get stats
`GET /stock/stats`

Headers
```json
{
  Authorization: "Bearer ${myAccessToken}"
}
```
Use `accessToken` value, obtained from login response.

Response example
```json
[
  {
    "stock": "STOCK.SYMBOL",
    "times_requested": 1
  }
]
```
**NOTE:** Only admins can access this endpoint.