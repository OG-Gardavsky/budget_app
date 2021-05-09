# Budget_app
Self-hosted open-source app for managing personal finances.  
See demo page https://gardavsky-budget-app.herokuapp.com/ 

***
This is open-source project created as a part of bachelor thesis at 
***<a href="https://fis.vse.cz/">Faculty of Informatics and Statistics</a>*** of 
***<a href="www.vse.cz">Prague University of Economics and Business </a>***
by Ondřej Gardavský
***

## Features:
- User management
  - multiple users can use one instance of app without accessing affecting each other
- Account management
    - helps you to keep an eye on all of your accounts
    - know balance 
        - per account
        - overall summary how much money you have
    - supported types:
        - debit - for your debit account
        - credit - for your credit card 
            - know your maximal and current available limit
        - cash - for your wallet or money box
- incomes and expenses management
    - put down all your financial transactions to know what you spend ang get money on 
      <!-- evidovat proste -->
    - your transaction are categorized
- category management
    - sort your incomes and expenses by categories
- summary of incomes/expenses
    - your incomes and expenses are summarized by categories
    - get summary for given month of your incomes/expenses
- debts management
    - put down who you lended or from who you borrowed money
        <!-- evidovat proste -->
- invest mangement
    - put down to where you invested your money
        <!-- evidovat proste -->

***
## Technologies
- NPM for managing packages
- Backend
    - Node.js as main run-time enviroment
    - Express for APIs and serving FE
    - MongoDB as database
- Frontend
    - Vue.js as front-end framework
    - Material design for look
- External services
  - ***<a href="https://sendgrid.com/">SendGrid</a>*** for sending emails
  - ***<a href="https://www.currencyconverterapi.com/">Currency Converter API</a>*** for getting list of currencies
  
- Hosting 
    - anything where you can run Node.js and MongoDB
    - I used:
        - ***<a href="https://www.heroku.com/">Heroku</a>*** for running application logic
        - ***<a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a>*** for hosting of MongoDB database (free version)

***
## License

Budget_app is completely free and released under the [MIT License](https://github.com/OG-Gardavsky/budget_app/blob/main/LICENSE).

***
## Get started

First of all clone this repo
```
git clone https://github.com/OG-Gardavsky/budget_app.git
```

Open cloned repo
```
cd budget_app
```

configure project constats - in server/src/config/constants.js


```
const constants = {
    dbAdrres: '',
    bcryptSaltRounds: 10,
    jwtKey: ',
    currencyApiKey : '',
    sendGridApiKey: '',
    emailAdressForSending: ''
}
```

#### dbAdrres
- this is address of database, with which will app work with
- fill adress of your database


#### bcryptSaltRounds
- this determines how many rounds of hashing password Bcrypt must perform
- I recommend keeping default value of 10

#### jwtKey
- this represents JWT secret that will be used for signing JWT tokens on server side
- choose some random characters - the more complex string, the safer verifications is

#### currencyApiKey
- this is API key for ***<a href="https://www.currencyconverterapi.com/">Currency Converter API</a>*** service
- ask for your key on their websites and get key

#### sendGridApiKey
- this is API key for ***<a href="https://sendgrid.com/">SendGrid</a>*** service
- register on their websites and get their key


#### emailAdressForSending
- this is email from which will be sent notifications from (currently link for forgotten password)
- use some email you have access to, this need to be verified in ***<a href="https://sendgrid.com/">SendGrid</a>***


### I want to modify and deploy

install npm dependencies
```
cd client 
npm install
cd ../server
npm install
```

if want start app for dev purposes - use two terminals
```
npm run devServer

npm run devClient
```

No you can modify code, as you wish. If you perform some modification on client side, you need to build the code to work properly on server
```
cd client 
npm run build
```

After that you can deploy your modified code where you want


### I just want to just deploy
- switch to deploy branch
- save your filled config file 
- deploy your code 



***
## Tests
As a main testing tool during development was used ***<a href="postman.com">Postman</a>***. For manual as well as automated tests. Definitions of theese collections are located in:
```
server/docs/postman
```

***
## Contributing
If you would like to contribute to this project, every contribution is welcomed, see [Contributing](https://github.com/OG-Gardavsky/budget_app/blob/main/CONTRIBUTING.md).
