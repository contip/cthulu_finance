import React from "react";
import { BehaviorSubject } from "rxjs";
import { report } from "process";
import { ILoginInput } from "./login";

/* current user data (jwt token value and user data) stored as a subscribable
 * rxjs BehaviorSubject */
const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser")!)
);

/* TODO: also define an interface for user objects (i.e. exactly what is stored
 * in localstorage), and put them in a separate interfaces file/folder */
 export interface IUser {
   accessToken: string;
   userData: IUserData
 }

 export interface IUserData {
   id: number;
   username: string;
   cash: number;
   holdings: Array<IUserHolding> 
 }

 export interface IUserHolding {
   stock_name: string;
   stock_symbol: string;
   shares: number
 }

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

async function login(data: ILoginInput) {
  await fetch("http://localhost:6969/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.accessToken) {
        /* bad login... alert user and reload login form */
        alert("invalid username / password!  plz tried again");
        /* call service_unauthorized()  -- general function to drop user from whatever they are accessing and bring to the login page */
        logout();
        return;
      } else {
        // localStorage.currentUser.token = response.access_token;
        // console.log("im in auth, user been found, response token is: " + response.access_token);
        // console.log('previous to calling next, currentUserSubject value is: ' + JSON.stringify(currentUserSubject.value));
        // currentUserSubject.subscribe({
        //     next: (v) => console.log(v),

        // })
        // console.log(response);
        let user = response;
        console.log(JSON.stringify(user));
        localStorage.setItem("currentUser", JSON.stringify(user));
        currentUserSubject.next(user);
        // authService.currentUser.subscribe({
        //     next: (v) => {
        //         localStorage.currentUser = v;
        //     }
        // })
        // currentUserSubject.next(response.access_token);
        // localStorage['currentUser'] = JSON.stringify(currentUserSubject.value);
        // console.log('after calling next, currentUserSubject value is: ' + JSON.stringify(currentUserSubject.value));
        // console.log('value of local storage is: ', localStorage['currentUser']);
        // console.log('again is: ' + localStorage.getItem('currentUser'));
        // console.log(currentUserSubject.getValue().token);

        // console.log("im in auth, uesr been found, localstorage currentuser  is: " + localStorage.getItem('currentUser'));
        return;
      }
    });
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
  let response = await fetch("http://localhost:6969/auth/users", {
    method: "GET",
    headers: authHeader(),
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

function authHeader(): { "Content-Type": string; Authorization: string } | {} {
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
