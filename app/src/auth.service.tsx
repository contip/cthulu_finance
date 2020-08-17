import { BehaviorSubject } from 'rxjs';
import { report } from 'process';

// const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
//  localStorage.clear();
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')!));

// console.log(currentUserSubject.value);
// console.log(currentUserSubject);
// console.log(localStorage.getItem('currentUser'));
interface IFormInput {
  username: string;
  password: string;
}

export const authService = {
    login,
    logout,
    authHeader,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

async function login(data: IFormInput) {
    await fetch('http://localhost:6969/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(response => {
            if (!response.accessToken) {
                /* bad login... alert user and reload login form */
                alert("invalid username / password!  plz tried again");
                /* call service_unauthorized()  -- general function to drop user from whatever they are accessing and bring to the login page */
                logout();
                return;
            }
            else {
                // localStorage.currentUser.token = response.access_token;
                // console.log("im in auth, user been found, response token is: " + response.access_token);
                // console.log('previous to calling next, currentUserSubject value is: ' + JSON.stringify(currentUserSubject.value));
                // currentUserSubject.subscribe({
                //     next: (v) => console.log(v),

                // })
                // console.log(response);
                let user = response;
                // console.log(JSON.stringify(user));
                localStorage.setItem('currentUser', JSON.stringify(user));
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
        })
     }

function logout(): void {
    /* remove any token / current user in the session storage */
    console.log('auth service logout function has just been called');
    localStorage.clear();
    currentUserSubject.next(null);
    //window.location.reload(false);
    /* somehow let the app know to re-render the LOGIN page */

}

function authHeader() {
    /* returns HTTP authorization header containing the JWT auth token of 
    * the currently logged-in user.  if user isn't logged in, returns an 
    * empty object instead */
   const currentUser = authService.currentUserValue;
   if (currentUser && currentUser.accessToken) {
       return { Authorization: `Bearer ${currentUser.accessToken}` };
   }
   else {
       return {};
   }
}