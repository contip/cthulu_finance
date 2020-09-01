import { BehaviorSubject } from "rxjs";
import { IUser } from "../data/interfaces";

/* current user data (jwt token value and user data) stored as a subscribable
 * rxjs BehaviorSubject */
const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser")!)
);

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

async function login(userData: IUser) {
  localStorage.setItem("currentUser", JSON.stringify(userData));
  currentUserSubject.next(userData);
}

function logout(): void {
  /* remove any token / current user in the session storage */
  console.log("auth service logout function has just been called");
  localStorage.clear();
  currentUserSubject.next(null);
}

/* i might be able to put this function in the home component and
 * just use the ApiCall function */
async function updateUserData(): Promise<void> {
  /* gets price data for user portfolio, updates localstorage with fresh JWT */
  let header = await authHeader();
  let response = await fetch("http://localhost:6969/auth/users", {
    method: "GET",
    headers: header,
  });
  if (response.status == 401) {
    logout();
    return;
  }
  let userData = await response.json();
  localStorage.setItem("currentUser", JSON.stringify(userData));
  /* update the user data globally? */
  currentUserSubject.next(userData);
  return; 
}

function newUser(res: any) {
  /* if a new user has registered, this logs them in and sets state */
  if (!res.accessToken || !res.userData) {  /* jic, should not be possible */
    return logout();
  }
  localStorage.setItem("currentUser", JSON.stringify(res));
  currentUserSubject.next(res);
}

async function authHeader(): Promise<{ "Content-Type": string; Authorization: string } | {}> {
  /* returns HTTP authorization header containing the JWT auth token of
   * the currently logged-in user.  if user isn't logged in, returns an
   * empty object instead */
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
