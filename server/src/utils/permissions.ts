import { shield } from 'graphql-shield'
// import { isAuthenticated } from './rules'

export const permissions = shield(
  {
    Mutation: {
      // sendVerificationEmail: isAuthenticated,
      // sendPasswordResetEmail: isAuthenticated,
    },
  },
  { allowExternalErrors: true },
)
