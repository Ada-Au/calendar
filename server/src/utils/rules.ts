import { rule } from 'graphql-shield'

export const isAuthenticated = rule({ cache: 'contextual' })(
  (parent, args, { user }) => {
    return user !== null
  },
)
