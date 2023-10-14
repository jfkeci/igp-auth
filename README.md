# iGP Auth

### Running the application

1. Opet the terminal and clone the repo
```bash
git clone https://github.com/jfkeci/igp-auth
```

2. Get inside the directory
```bash
cd igp-auth
```

3. Instal dependencies
```bash
npm install
```

4. Setup .env
```bash
cp .env.example .env
```
- Set valid env variables to run the app

5. Run the build
```bash
npm run build
```
- you don't normally need to do this for development, but i've made a static app for notification testing that is being served by the express api and this is required so that the index.html from the src/public directory gets copied to the dist directory

6. Run the app
```bash
npm run dev
```
- the app will be running on `http://localhost:3000` (depending on the API_PORT env variable)

### Swagger Docs
- Available at `http://localhost:3000/docs` when running the application

### Postman docs
- Postman collection json available [here](https://github.com/jfkeci/igp-auth/blob/main/docs/iGP%20Auth.postman_collection.json)
    - You can download the json and import it to postman

### Requirements
#### Node.js 
- Minimum version: 18.0.0
- Check it out [Here](https://nodejs.org/en)

#### npm
- node package manager
- it usually gets installed alongside Node.js

#### Postman (optional)
- Used for REST API and websocket server testing
- Check it out [Here](https://www.postman.com/)

#### Docker (optional)
-  [Mac OS](https://docs.docker.com/desktop/install/mac-install/)
-  [Windows](https://docs.docker.com/desktop/install/windows-install/)
-  [Linux](https://docs.docker.com/desktop/install/linux-install/)