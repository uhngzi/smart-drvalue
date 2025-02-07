import { cookieName } from "@/api/lib/config"
import cookie from "cookiejs"

export const loginCheck = () => {
  if(typeof window === 'undefined') return false;
  if(typeof window !== 'undefined') {
    const token = cookie.get(cookieName);
    if (token) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export const logout = () => {
  if(typeof window === 'undefined') return false;
  if(typeof window !== 'undefined') {
    cookie.remove(cookieName);
  }
}