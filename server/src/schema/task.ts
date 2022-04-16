import { objectType, extendType } from 'nexus'

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
  },
})
