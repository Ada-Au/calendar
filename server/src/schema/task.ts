import { objectType, extendType, nonNull, intArg } from 'nexus'
import dayjs from 'dayjs'
import createError from 'http-errors'

// Type Defs
export const Task = objectType({
  name: 'Task',
  description: 'Task for event on calendar.',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.title()
    t.model.description()
    t.model.completed({ description: 'Check if event is completed.' })
    t.model.updatedAt({ description: 'When the task is last updated.' })
    t.model.startTime({
      description:
        'The starting time of event. Default as create time. Use for getting the date if event is full day.',
    })
    t.model.endTime({
      description: 'The starting time of event. Must be set if not full day.',
    })
    t.model.isFullDay({
      description: 'Show that the event is full day. Default as fault',
    })
    t.model.todos({
      description: 'The todos of this task',
      ordering: true,
      filtering: true,
      pagination: true,
    })
  },
})

// Query
export const TaskQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.task()
    t.crud.tasks({
      ordering: true,
      filtering: true,
      pagination: true,
    })
  },
})

// Mutation
export const TaskMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneTask()
    t.crud.updateOneTask()
    t.nonNull.field('toggleCompleteTask', {
      type: 'Task',
      description: 'Toggle the completeness of Task.',
      args: {
        id: nonNull(intArg({ description: 'The id of the task.' })),
      },
      async resolve(_root, { id }, { prisma }) {
        let task = await prisma.task.findUnique({
          where: { id },
          select: { completed: true },
        })

        if (task?.completed != null) {
          return await prisma.task.update({
            where: { id },
            data: {
              completed: !task.completed,
              updatedAt: dayjs().toISOString(),
            },
          })
        } else {
          throw createError(401, 'Task not exist!')
        }
      },
    })
  },
})
