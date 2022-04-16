import { makeSchema, fieldAuthorizePlugin } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { transformSchemaFederation } from 'graphql-transform-federation'
import * as types from './schema/index'

import { join } from 'path'

const schema = makeSchema({
  types,
  plugins: [
    nexusPrisma({ experimentalCRUD: true, paginationStrategy: 'prisma' }),
    fieldAuthorizePlugin(),
  ],
  outputs: {
    typegen: join(__dirname, 'generated', 'index.d.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
    alias: 'ctx',
  },
  shouldExitAfterGenerateArtifacts:
    process.env.NEXUS_SHOULD_EXIT_AFTER_GENERATE_ARTIFACTS === 'true',
})

const federatedSchema = transformSchemaFederation(schema, {
  Query: {
    extend: true,
  },
  User: {
    keyFields: ['id'],
    resolveReference(reference: any, ctx: any) {
      return ctx.prisma.user.findUnique({ where: { id: reference.id } })
    },
  },
  Task: {
    keyFields: ['id'],
    resolveReference(reference: any, ctx: any) {
      return ctx.prisma.task.findUnique({ where: { id: reference.id } })
    },
  },
  Todo: {
    keyFields: ['id'],
    resolveReference(reference: any, ctx: any) {
      return ctx.prisma.todo.findUnique({ where: { id: reference.id } })
    },
  },
})

export default federatedSchema
