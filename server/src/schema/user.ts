import { Prisma } from '.prisma/client'
import { addCrudResolvers } from '@ra-data-prisma/backend'
import bcrypt from 'bcryptjs'
import createError from 'http-errors'
import { objectType, extendType } from 'nexus'

// For react admin
export const crudUser = addCrudResolvers('User')

// Type Defs
export const User = objectType({
  name: 'User',
  description: 'The User Account data.',
  definition(t) {
    t.model.id()
    t.model.name({ description: 'The name of the user.' })
    t.model.email({
      description:
        'The user email used to create and uniquely identify this account and user data.',
    })
    t.model.createdAt({
      description:
        'The timestamp (UTC in ISO 9601 Standard) this user was created.',
    }),
      t.model.password({ description: 'The user account password.' })
  },
})

// Queries
export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      description: 'Get my user data',
      resolve(_root, _args, { user, prisma }) {
        return prisma.user.findUnique({ where: { id: user.id } })
      },
    })
    t.crud.user()
    t.crud.users({
      ordering: true,
      filtering: true,
      pagination: true,
    })
  },
})

// Mutation
export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneUser({
      async resolve(
        root,
        { data }: { [data: string]: { [key: string]: any } },
        { prisma, user },
      ) {
        const { name, email, password } = data
        const hashedPassword = password && (await bcrypt.hash(password, 10))

        let duplicateUser = await prisma.user.findUnique({ where: { email } })
        if (duplicateUser) {
          throw createError(
            403,
            `${email} has already been registered with another account!`,
          )
        }

        const userCreateInput: Prisma.UserCreateInput = {
          ...data,
          name,
          email,
          password: hashedPassword,
        }

        const createdUser = await prisma.user.create({
          data: userCreateInput,
        })

        return createdUser
      },
    })
    t.crud.updateOneUser({
      async resolve(
        root,
        {
          data,
          where,
        }: { data: { [key: string]: any }; where: { [key: string]: any } },
        { prisma, user },
      ) {
        const { password } = data
        const hashedPassword = password && (await bcrypt.hash(password.set, 10))
        const userUpdateInput: Prisma.UserUpdateInput = {
          ...data,
          password: hashedPassword,
        }

        const updatedUser = await prisma.user.update({
          data: userUpdateInput,
          where,
        })

        return updatedUser
      },
    })
  },
})
