import React from "react";
import { BehaviorSubject } from "rxjs";
import { report } from "process";
import { ILoginInput, IUser } from "./interfaces";

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

// async function login(data: ILoginInput) {
//   await fetch("http://localhost:6969/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((response) => {
//       if (!response.accessToken) {
//         /* bad login... alert user and reload login form */
//         alert("invalid username / password!  plz tried again");
//         /* call service_unauthorized()  -- general function to drop user from whatever they are accessing and bring to the login page */
//         logout();
//         return;
//       } else {
//         let user = response;
//         console.log(JSON.stringify(user));
//         localStorage.setItem("currentUser", JSON.stringify(user));
//         currentUserSubject.next(user);
//         return;
//       }
//     });
// }

async function login(userData: IUser) {
  localStorage.setItem("currentUser", JSON.stringify(userData));
  currentUserSubject.next(userData);
}

function logout(): void {
  /* remove any token / current user in the session storage */
  console.log("auth service logout function has just been called");
  localStorage.clear();
  currentUserSubject.next(null);
  //window.location.reload(false);
  /* somehow let the app know to re-render the LOGIN page */
}

async function updateUserData(): Promise<void> {
  /* gets price data for user portfolio, updates localstorage with fresh JWT */
  console.log("bitch i'm being called");
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

async function newUser(res: any) {
  /* if a new user has registered, this logs them in and sets state */

  if (!res.accessToken || !res.userData) {
    alert("error registering user!");
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
