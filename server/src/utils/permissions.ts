import { allow, shield } from 'graphql-shield'
import { isAuthenticated } from './rules'

export const permissions = shield(
  {
    Query: {
      user: allow,
      users: isAuthenticated,
      me: isAuthenticated,
      task: isAuthenticated,
      tasks: isAuthenticated,
      myTasks: isAuthenticated,
      todo: isAuthenticated,
      todos: isAuthenticated,
    },
    Mutation: {
      createOneUser: isAuthenticated,
      updateOneUser: isAuthenticated,
      updateManyUser: isAuthenticated,
      upsertOneUser: isAuthenticated,
      deleteOneUser: isAuthenticated,
      deleteManyUser: isAuthenticated,
      createOneTask: isAuthenticated,
      updateOneTask: isAuthenticated,
      toggleCompleteTask: isAuthenticated,
      createOneTodo: isAuthenticated,
      updateOneTodo: isAuthenticated,
      toggleCompleteTodo: isAuthenticated,
      login: allow,
      signUp: allow,
    },
  },
  { allowExternalErrors: true },
)
