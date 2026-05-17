### MY PROJECT NODEJS ARCHITECTURE FORM A -> Z ###

*NOTE*
- Should use singleton write model for db to reuse, avoid call many times
- Public key will be saved in DB, Private key is not
- After save publicKey in DB, we need get publicKey convert publickey

*** SECTION 5: Api Sign-up Shop (FULL) triển khai thuật toán RSA và JWT cho hai level ***
VIETNAMESS:
- Flow sign-up of a shop
- asymmetrical algorithm between accessToken and refreshToken
- How to save file pem vào mongodb và get to decode
- detached the module to re use

*** Section 6: Custom Dynamic Middleware for ApiKey and Permissions ***
PURPOSE: CHECK IF SOMETHING USES OUR API OR NOT
- Check user have api-key
- Check permossions of user
-> litmit user use api and user use permission in application

*** Section 7: Handle ErrorHandle in API ***
PURPSOSE: HANDLE ERROR AFTER ROUTER NEXT 
- Function middleware only 3 params
- Function handle error has 4 params
- Error of Nodejse, we can entend it

*** Section 8: Make your API Reponse use class ***
PURPOSE: HANDLE SUCCESS WHEN HANDLE API
- Remember send res !!!

*** Section 9: Login Shop API ***
- Principle what is written second so create utils
- FE check cookie for not query db check token
- In DB, findOneAndUpdate has options: upsert: true, new: true mean is if not yet so create opposite update


*** Section 10: Logout vs Authentication ***
- write 1 authentication in order to check who want to damage my server
- must check access token, can't logout if haven't AT or RT
- request FR must have 3 param
- use Redis save AT and RT
- remove keyToken when client logout