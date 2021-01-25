import prisma from '../prisma'

export interface userCreateInput {
  email: string,
  password: string
}

export interface userUniqueSearchInput {
  id?: number,
  email?: string
}

const createUser = (data: userCreateInput) => {
  return prisma.users.create({ data })
}

const findUser = (data: userUniqueSearchInput) => {
  const [uniqueKey] = Object.keys(data)
  return prisma.users.findUnique({ where: {[uniqueKey]: data[uniqueKey]}})
}

export default {
  createUser,
  findUser
}