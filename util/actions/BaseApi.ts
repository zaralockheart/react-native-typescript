export class BaseApi {
  authFailed = () => {
    throw new Error('Not implemented')
  }

  getAuthHeaders = () => {
    throw new Error('Not implemented')
  }
}
