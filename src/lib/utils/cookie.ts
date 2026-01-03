import Cookies from "js-cookie";
export const TokenKey = {
  token: 'token',
}

export function getToken() {
  return Cookies.get(TokenKey.token)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey.token, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey.token)
}
