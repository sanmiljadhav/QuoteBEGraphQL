import { ApolloServer, gql } from 'apollo-server'
import dotenv from 'dotenv'
dotenv.config();
import resolvers from './resolvers.js'
import typeDefs from './schemaGql.js'

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import mongoose from 'mongoose'
import { connectDB } from './db.config.js'
import jwt from 'jsonwebtoken'

// console.log('PROCESS ENV',process.env)

const PORT = process.env.PORT || 4000;

console.log("PROCEESS", process.env.PORT)

connectDB();




// import models here
import './models/User.js'
import './models/Quotes.js'


//CONTEXT - MIDDLEWARE

const context = ({req})=>{

        console.log('REQ HEADERS ARE', req.headers)

        const {authorization} = req.headers
        console.log('AUTH IS',authorization)
        if(authorization){
            const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)
            return {userId}

        }

    }


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:context,
   

})


server.listen({ port: PORT }).then(({ url }) => {
console.log(`🚀 Server ready at ${url}`);
});



// Notes
// Exclamation makes field mandatory

// user:(_,args)- Ist argument contains parent, second contains args

// context -> Koi bhi resolver me request janese pehle context me request me
// wo receive karr sakte hai

// 8 --> 8.13