import { objectType, extendType, nonNull, intArg } from 'nexus'
import dayjs from 'dayjs'
import createError from 'http-errors'

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
    t.nonNull.field('toggleCompleteTodo', {
      type: 'Todo',
      description: 'Toggle the completeness of Todo.',
      args: {
        id: nonNull(intArg({ description: 'The id of the todo.' })),
      },
      async resolve(_root, { id }, { prisma }) {
        let todo = await prisma.todo.findUnique({
          where: { id },
          select: { completed: true },
        })

        if (todo?.completed != null) {
          return await prisma.todo.update({
            where: { id },
            data: {
              completed: !todo.completed,
              updatedAt: dayjs().toISOString(),
            },
          })
        } else {
          throw createError(401, 'Todo not exist!')
        }
      },
    })
  },
})
