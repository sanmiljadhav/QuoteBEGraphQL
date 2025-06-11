import { ApolloServer, gql } from 'apollo-server'

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'



const typeDefs = gql`

type Query{
    users:[User]
    quotes:[QuoteWithQuouteDetails]
    user(_id:ID!):User
    iquote(by:ID!):[Quote]
    myprofile:User

}

type Token{
token:String
}

type Mutation{

signupUserDummy(firstName:String!,lastName:String!,email:String!,password:String!):User,
signinUser(userSignin:UserSigninInput!):Token
createQuote(name:String!):String
updateQuote(id: ID!, name: String!): String
deleteQuote(id: ID!): String




}



type User{
_id:ID
firstName:String!
lastName:String!
email:String!
quotes:[Quote]


}

type QuoteWithQuouteDetails{
_id:ID!
name:String!
by:IdName!
}


type IdName{
_id:String
firstName:String
lastName:String
}

type Quote{
_id:ID!
name:String
by:ID!
}

input UserSigninInput{


email:String!
password:String!

}

`

export default typeDefs
