import bcrypt, { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserService } from '../services'
import { errorWrapper, errorGenerator} from '../errors'
import { Request, Response } from 'express'
import { userCreateInput } from '../services/UserService'
const { AUTH_TOKEN_SALT } = process.env

const signUp = errorWrapper(async (req: Request, res: Response) => {
  const { email, password }: userCreateInput = req.body
  if (!email || !password) errorGenerator({ statusCode: 400 })

  const foundUser = await UserService.findUser({ email })
  if (foundUser) errorGenerator({ statusCode: 409 })

  const hashedPassword = await bcrypt.hash(password, 10)

  const createdUser = await UserService.createUser({
    email,
    password: hashedPassword
  })

  res.status(201).json({
    message: 'user created',
    email: createdUser.email
  })
})

const logIn = errorWrapper(async (req: Request, res: Response) => {
  const { email, password: inputPassword }: userCreateInput = req.body

  if (!email || !inputPassword) errorGenerator({ statusCode: 400 })

  const foundUser = await UserService.findUser({ email })
  if (!foundUser) errorGenerator({ statusCode: 400 })

  const { id, password: hashedPassword } = foundUser
  const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword)
  if (!isValidPassword) errorGenerator({ statusCode: 400 })

  const token = jwt.sign({ id }, AUTH_TOKEN_SALT)
  res.status(200).json({ message: 'login success', token })
})

export default {
  logIn,
  signUp
}