# Budget_app
Self-hosted open-source app for managing personal finances.  
See demo page https://gardavsky-budget-app.herokuapp.com/

***
This is an open-source project created as a part of a bachelor thesis at
***<a href="https://fis.vse.cz/">Faculty of Informatics and Statistics</a>*** of
***<a href="www.vse.cz">Prague University of Economics and Business </a>***
by Ondřej Gardavský
***

## Features:
- User management
    - multiple users can use one instance of the app without affecting each other
- Account management
    - helps you to keep an eye on all of your accounts
    - see your balance
        - per account
        - overall summary how much money you have
    - supported types:
        - debit - for your debit account
        - credit - for your credit card
            - know your maximal and current available limit
        - cash - for your wallet or money box
- incomes and expenses management
    - record all your financial transactions to know what you spend your money on and where you get it from
    - your transactions are categorized
- category management
    - sort your incomes and expenses by categories
- summary of incomes/expenses
    - your incomes and expenses are summarized by categories
    - get a summary for given month of your incomes/expenses
- debts management
    - record who you lended or from who you borrowed money
- invest mangement
    - record where you invested your money

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
    - anywhere you can run Node.js and MongoDB
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
- this is the address of the database, with which the app will work with
- fill the address of your database


#### bcryptSaltRounds
- this determines how many rounds of hashing password Bcrypt must perform
- I recommend keeping the default value of 10

#### jwtKey
- this represents JWT secret that will be used for signing JWT tokens on server side
- choose some random characters - the more complex string, the safer the verifications is

#### currencyApiKey
- this is API key for ***<a href="https://www.currencyconverterapi.com/">Currency Converter API</a>*** service
- ask for your key on their websites and get a key

#### sendGridApiKey
- this is API key for ***<a href="https://sendgrid.com/">SendGrid</a>*** service
- register on their websites and get their key


#### emailAdressForSending
- this is the email from which the notifications will be sent (currently link for forgotten password)
- use an email you have access to, this needs to be verified at ***<a href="https://sendgrid.com/">SendGrid</a>***


### I want to modify and deploy

install npm dependencies
```
cd client 
npm install
cd ../server
npm install
```

if you want to start the app for dev purposes - use two terminals
```
npm run devServer

npm run devClient
```

Now you can modify the code as you wish. If you perform some modification on client side, you need to build the code to work properly on the server
```
cd client 
npm run build
```

After that you can deploy your modified code where you want


### I just want to deploy 
- switch to deploy branch
- save your filled config file
- deploy your code



***
## Tests
As a main testing tool during development ***<a href="postman.com">Postman</a>*** was used. For manual, as well as automated tests. Definitions of theese collections are located in:
```
server/docs/postman
```

***
## Contributing
If you would like to contribute to this project, every contribution is welcomed. See [Contributing](https://github.com/OG-Gardavsky/budget_app/blob/main/CONTRIBUTING.md).
