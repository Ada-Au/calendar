import { Prisma } from '.prisma/client'
import { addCrudResolvers } from '@ra-data-prisma/backend'
import bcrypt from 'bcryptjs'
import createError from 'http-errors'
import { stringArg, nonNull, objectType, extendType } from 'nexus'
import jwt from 'jsonwebtoken'

// For react admin
export const crudUser = addCrudResolvers('User')

export const AuthPayload = objectType({
  name: 'AuthPayload',
  description: 'Authentication Payload.',
  definition(t) {
    t.nonNull.string('token', { description: 'Authentication token.' })
  },
})

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
    })
    t.model.password({ description: 'The user account password.' })
    t.model.tasks({ description: 'Tasks that belong to the user' })
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
    t.nonNull.field('login', {
      type: 'AuthPayload',
      description: 'Normal email and password login.',
      args: {
        email: nonNull(stringArg({ description: 'The user account email.' })),
        password: nonNull(
          stringArg({ description: 'The user account password.' }),
        ),
      },
      async resolve(_root, { email, password }, { prisma }) {
        const userSelectData = {
          id: true,
          password: true,
          name: true,
        }
        let user = await prisma.user.findUnique({
          where: { email },
          select: userSelectData,
        })

        if (user) {
          const passwordValid = await bcrypt.compare(password, user.password)
          if (!passwordValid) {
            throw createError(401, 'Invalid Password!')
          }
        } else {
          throw createError(401, 'User not exist!')
        }

        const { id } = user
        const token = jwt.sign(
          {
            user: {
              id,
              email,
            },
          },
          process.env.APP_SECRET,
        )

        return { token }
      },
    })
    t.nonNull.field('signUp', {
      type: 'AuthPayload',
      description: 'User sign up in site.',
      args: {
        name: nonNull(stringArg({ description: 'The user name.' })),
        email: nonNull(stringArg({ description: 'The user account email.' })),
        password: nonNull(
          stringArg({ description: 'The user account password.' }),
        ),
      },
      async resolve(_root, { name, email, password }, { prisma }) {
        let duplicateUser = await prisma.user.findUnique({ where: { email } })
        if (duplicateUser) {
          throw createError(
            403,
            `${email} has already been registered with another account!`,
          )
        }

        const userCreateInput: Prisma.UserCreateInput = {
          name,
          email,
          password,
        }

        const createdUser = await prisma.user.create({
          data: userCreateInput,
        })

        return createdUser
      },
    })
  },
})
