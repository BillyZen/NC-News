# Northcoders News Project


Developer files required -
.env.test
.env.development

Create these .env files by setting them up in your app directory, adding one line PGDATABASE = {db-name-here} and adding them to your .gitignore file


Node.JS must be ^v14.15.4 and Postgres must be ^PostgreSQL 14


Here is the link to the hosted version - https://will-news-app-nc.herokuapp.com/


This is a backend focused project to demonstrate the use of building an Express.js Server, Programatically seeding a PSQL Database, building different types of endpoints, using the MVC method and carrying it all out with extensive TDD.


Cloning Repo : In command line of where you would like the repo to sit in your file structure - $git clone https://github.com/BillyZen/NC-News.git

Seeding Database : NPM init to initialise all node packages within the installed dependencies, then use the command npm setup-dbs followed by npm seed

Testing : If Jest has been sucessfully installed, along with Supertest, use $npm t in the command line to run tests. Specify app.test.js after this line or utils.test.js if you only want to test one.


Thanks for checking out my backend project, if you have any suggestions on how to improve please don't hesitate to let me know! :)