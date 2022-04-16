import { rule } from 'graphql-shield'
import { AuthenticationError } from 'apollo-server'

export const isAuthenticated = rule({ cache: 'contextual' })(
  (parent, args, { user }) => {
    if (user === null) {
      return new AuthenticationError('Token Missing')
    }
    if (user.error) {
      return new AuthenticationError(user.error.message)
    }
    return true
  },
)
