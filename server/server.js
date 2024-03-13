//require express package, import express package
//express is like a framework, which you can install a lot of middleware
//middleware for static display (html), middleware to run GraphQL, middleware for DB (MongoDB)
//middleware run on top of Express, so that it can be understood by Node ecosystem
//Node ecosystem is the one help so your server can run JavaScript (usually JavaScript could be run in browser)
const express = require('express');

const { MongoClient } = require('mongodb');

//added below 2 lines for doing the GraphQl part
//fs is file system packet, we need file-read operation
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');

let db;
async function connectToDb() {
	//Marvel is the database name we created, case-sensitive
	const url = 'mongodb://localhost/Marvel';
	const client = new MongoClient(url, { useNewUrlParser: true });
	//actually made the connection
    try {
        await client.connect();
        console.log('Connected to MongoDB at', url);
        db = client.db();
        console.log(await db.collection('characters').find({}).toArray());
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit the process with an error code
    }
}

//instantiate the express?
const app = express();

//static web server, display static (not changing) things
//express going to run in public fodler
//index.html and app.js is in public holder
app.use(express.static('public'));

/*************** GRAPHQL SETUP START ***************/

//resolve the function when the query are called
const resolvers = {
	Query: {
		getAllCharactersinfo,
		getCharacterinfo,
	},
	Mutation: {
		addCharacter
	}
};

async function getAllCharactersinfo()
{
	  result = await db.collection('characters').find({}, {name:1, gender:1}).toArray();
	  console.log(result)
	  return result
};

//the first argument is to be revoked, hence we need to create a placeholder to inform the code its actually empty
async function getCharacterinfo(_, args)
{
	  //cname is lcoal variable, get from the argument (from the user)
	  cname = args.name
	  console.log(cname)
	  //dont actually need to convert to Array, but here Prof just copy from somewhere he said
	  result = await db.collection('characters').find({name: cname}, {name:1, gender:1}).toArray();
	  console.log(result)
	  return result[0]
};

async function addCharacter(_, args)
{
	//to know and check in this terminal, is the args shown correctly
	console.log(args)
	const newcharacter = {'name': args.name, 'gender': args.gender}
	//console.log(newcharacter)
	result = await db.collection('characters').insertOne(newcharacter);
	//can also print the result here, to make sure the insert is correct
	return true
};

//Create GQL
const server = new ApolloServer({
	typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
	resolvers,
	//3 lines below is just for error handling
	formatError: error => {
	  console.log(error);
	  return error;
	},
  });
  //this will make your graphql run on localhost:3000/graphql
  server.applyMiddleware({ app, path: '/graphql' });

/*************** GRAPHQL SETUP ENDS ***************/


//might not be okay to called in directly here as it is async function
(async function () {
await connectToDb();

//where you actually start the server
//below is anonymous function without name, but can actually called any function
app.listen(3000, function () {
	  console.log('App started on port 3000 successfully already');
});

})();