import { BehaviorSubject } from "rxjs";
import { IUser } from "../data/interfaces";

/* current user info (auth and holdings data) stored and provided to rest of 
 * app by rxjs observable */
const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser")!)
);

/* methods provided by the authentication service */
export const authService = {
  login,
  logout,
  authHeader,
  newUser,
  updateUserData,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

/* login stores userdata in local storage and updates global state by
 * pushing to the observable */
async function login(userData: IUser): Promise<void> {
  localStorage.setItem("currentUser", JSON.stringify(userData));
  currentUserSubject.next(userData);
}

/* log user out by clearing localStorage and setting observable next to null */
function logout(): void {
  localStorage.clear();
  currentUserSubject.next(null);
}

/* re-authenticates user by getting fresh JWT from server and adds price info
 * to user holdings */
async function updateUserData(): Promise<void> {
  let header = await authHeader();
  let response = await fetch("auth/users", {
    method: "GET",
    headers: header,
  });
  if (response.status === 401) {
    logout();
    return;
  }
  /* user is valid, so update localstorage and currentuser observable */
  let userData = await response.json();
  localStorage.setItem("currentUser", JSON.stringify(userData));
  currentUserSubject.next(userData);
  return;
}

/* if new user has registered, logs them in and sets state */
function newUser(res: IUser): void {
  if (!res.accessToken || !res.userData) {
    /* should not be possible */
    return logout();
  }
  localStorage.setItem("currentUser", JSON.stringify(res));
  currentUserSubject.next(res);
}

/* returns HTTP authorization header containing JWT of currently logged-in
 * user, otherwise empty object if user not logged in */
async function authHeader(): Promise<
  { "Content-Type": string; Authorization: string } | {}
> {
  const currentUser = authService.currentUserValue;
  if (currentUser && currentUser.accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.accessToken}`,
    };
  } else {
    return {};
  }
}
