*** MY PROJECT NODEJS ARCHITECTURE FORM A -> Z ***

*NOTE*
- Should use singleton write model for db to reuse, avoid call many times
- Public key will be saved in DB, Private key is not
- After save publicKey in DB, we need get publicKey convert publickey

*** SECTION 5: Api Sign-up Shop (FULL) triển khai thuật toán RSA và JWT cho hai level ***
VIETNAMESS:
- Luồng đăng ký của 1 shop
- Thuật toán bất đối xứng giữa accessToken và refreshToken
- Làm thế nào để lưu file pem vào mongodb và lấy ra để decode
- Tách biệt các module ra để tái sử dụng

*** Section 6: Custom Dynamic Middleware for ApiKey and Permissions ***
PURPOSE: CHECK IF SOMETHING USES OUR API OR NOT
