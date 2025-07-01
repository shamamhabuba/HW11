export class LoginDto {
  username: string
  password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  static loginWithCorrectData(): LoginDto {
    const username = process.env.USER || ''
    const password = process.env.PASSWORD || ''
    return new LoginDto(username, password)
  }
}
