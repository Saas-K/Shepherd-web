export interface ILogin {
  username: string,
  password: string
}

export interface ILoginResponse {
  username: string,
  accessToken: string,
  refreshToken: string,
  mobile: boolean
}