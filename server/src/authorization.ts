import jwt from 'jsonwebtoken'

export const getUser = (token: string): object | null => {
  try {
    if (token) {
      const payload: any = jwt.verify(token, process.env.APP_SECRET || '')
      return payload.user
    }
  } catch (error: any) {
    return { error }
  }
  return null
}
