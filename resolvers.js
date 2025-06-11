import { quotes, users } from './fakedb.js'
import { randomBytes } from 'crypto'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Quote from './models/Quotes.js'
import jwt from 'jsonwebtoken'





const resolvers = {
    Query: {
        users: async () => {

            const users = await User.find({})
            return users
        },
        quotes: async () => await Quote.find({}).populate("by", "_id firstName lastName"),
        user: async (_, { _id }) => {

            return await User.findOne({ _id: _id })
        },
        iquote: async (_, { by }) => await Quote.find({ by: by }),
        myprofile: async (_, args, context) => {
            const userid = context.userId

            // When headers dont have Token
            // User has to Login to see the profile page
            if (!userid) {
                throw new Error("You must be logged in")
            }

            return await User.findOne({ _id: userid })
        }
    },

    User: {
        // quotes: (ur) => quotes.filter(quote => quote.by == ur.id)
        quotes: async (ur) => await Quote.find({ by: ur._id })
    },

    Mutation: {
        signupUserDummy: async (_, { firstName, lastName, email, password }) => {

            try {

                console.log('FIRSTNAME', firstName)
                console.log('LASTNAME', lastName)
                console.log('EMAIL', email)
                console.log('PASSWORD', password)

                const user = await User.findOne({ email: email })
                if (user) {
                    throw new Error("User already exists with this email")
                }

                const hashedPassword = await bcrypt.hash(password, 12)
                const newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword
                })

                return await newUser.save()


            } catch (error) {
                console.error("Error in signupUserDummy:", error.message);
                throw new Error(error.message);

            }





        },

        signinUser: async (_, { userSignin }) => {
            // TODO
            try {

                const user = await User.findOne({ email: userSignin.email })
                if (!user) {
                    throw new Error("Invalid Credentials")
                }
                const doPasswordMatch = await bcrypt.compare(userSignin.password, user.password)
                if (!doPasswordMatch) {
                    throw new Error("Email or Password is Invalid")
                }

                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
                return { token }

            } catch (error) {

                console.error("Error in signinUserDummy:", error.message);
                throw new Error("Something went wrong during signup.");

            }

        },

        createQuote: async (_, { name }, context) => {

            console.log('CONTEXT IS', context)
            const userid = context.userId
            if (!userid) {
                throw new Error("You must be logged in")
            }

            const newQuote = new Quote({ name, by: userid })
            await newQuote.save()
            return "Quote Saved successfully"

        },
        updateQuote: async (_, { id, name }, context) => {
            console.log("ID OFQUOTE is ", id)
            const userid = context.userId;
            if (!userid) {
                throw new Error("You must be logged in");
            }

            const quote = await Quote.findOne({ _id: id });

            if (!quote) {
                throw new Error("Quote not found");
            }

            if (quote.by.toString() !== userid) {
                throw new Error("You are not authorized to edit this quote");
            }

            quote.name = name;
            await quote.save();
            return "Quote updated successfully";
        },

        deleteQuote: async (_, { id }, context) => {
            const userid = context.userId;
            if (!userid) {
                throw new Error("You must be logged in");
            }

            const quote = await Quote.findById(id);
            if (!quote) {
                throw new Error("Quote not found");
            }

            if (quote.by.toString() !== userid) {
                throw new Error("You are not authorized to delete this quote");
            }

            await Quote.findByIdAndDelete(id);
            return "Quote deleted successfully!";
        }


    }
}

export default resolvers