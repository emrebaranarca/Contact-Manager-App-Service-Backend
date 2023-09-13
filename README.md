
## Contact Manager App Service (BACKEND)

A token is created for each user. Users manage their contacts by logging in.




## Used Technologies


**Server:** Node, Express

**Database:** MongoDB

**Packages:** jsonwebtoken, bcrypt, dotenv, express-async-handler, mongoose, nodemailer


  
## Using API

#### Register - Login 

```http
  POST /api/user/register
```
```http
  POST /api/user/login
```
```http
  GET /api/user/current
```

#### Contact Add, Delete, Update, Get

```http
  GET /api/contact
```
```http
  GET /api/contact/:id
```
```http
  POST /api/contact
```
```http
  PUT /api/contact/:id
```
```http
  DELETE /api/contact/:id
```
#### User Reset Password 

```http
  POST /api/user/resetpassword
```
```http
  POST /api/user/resetpassword/:token
```



  
