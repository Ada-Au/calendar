import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'

import schema from './schema'
import { permissions } from './utils/permissions'

export const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null
    const origin = req.headers.origin !== 'null' ? req.headers.origin : null

    return {
      origin,
      user,
    }
  },
  mocks: process.env.NODE_ENV === 'test',
  introspection: true,
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
})
