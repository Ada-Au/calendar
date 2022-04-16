import { objectType, extendType } from 'nexus'

// Type Defs
export const Todo = objectType({
  name: 'Todo',
  description: 'Todo for each Task.',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.title()
    t.model.description()
    t.model.completed({ description: 'Check if todo is completed.' })
    t.model.updatedAt({ description: 'When the todo is last updated.' })
    t.model.task({ description: 'The task this todo belongs to.' })
  },
})

// Query
export const TodoQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.todo()
    t.crud.todos({
      ordering: true,
      filtering: true,
      pagination: true,
    })
  },
})

// Mutation
export const TodoMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneTodo()
    t.crud.updateOneTodo()
  },
})
