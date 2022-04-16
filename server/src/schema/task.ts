import {
  // mutationType,
  // stringArg,
  // nonNull,
  objectType,
  // extendType,
} from 'nexus'

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
    t.model.isFullDay('isFullDay', {
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
