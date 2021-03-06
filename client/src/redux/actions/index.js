export const LOGIN_CLICK = 'LOGIN_CLICK'
export const SIGNUP_CLICK = 'SIGNUP_CLICK'
export const G_LOGIN_CLICK = 'G_LOGIN_CLICK'
export const K_LOGIN_CLICK = 'K_LOGIN_CLICK' 
export const AUTH_REQUEST = 'AUTH_REQUEST'
export const SETUSERINFO = 'SETUSERINFO'

export const loginModal = (LoginModalState) => {
  return {
    type: LOGIN_CLICK,
    payload: {
      LoginModalState
    }
  }
}

export const signupModal = (SignupModalState) => {
  return {
    type: SIGNUP_CLICK,
    payload: {
      SignupModalState
    }
  }
}


export const gLogIn = (gLoginState) => {
  return {
    type: G_LOGIN_CLICK,
    payload: {
      gLoginState
    }
  }
}

export const kLogIn = (kLoginState) => {
  return {
    type: K_LOGIN_CLICK,
    payload: {
      kLoginState
    }
  }
}

export const authState = (authState) => {  
return {
    type: AUTH_REQUEST,
    payload: {
      authState
    }
  }
}

export const userInfo = (userInfo) => {
  return {
    type: SETUSERINFO,
    payload: {
      userInfo
    }
  }
}