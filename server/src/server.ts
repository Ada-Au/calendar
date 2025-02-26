import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

import schema from './schema'
import { permissions } from './utils/permissions'
import { getUser } from './authorization'

const prisma = new PrismaClient()

export const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: ({ req }) => {
    const token = req.headers.authorization as string
    let user
    if (token) user = getUser(token.split(' ')[1]) //  token = Bearer *****...

    return {
      user,
      prisma,
    }
  },
  mocks: process.env.NODE_ENV === 'test',
  introspection: true,
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
})
