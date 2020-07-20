import { BehaviorSubject } from 'rxjs';

// const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const currentUserSubject = new BehaviorSubject(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));

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

async function login(data: IFormInput): Promise<any> {
    fetch('http://localhost:6969/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(response => {
            if (!response.access_token) {
                /* bad login... alert user and reload login form */
                alert("invalid username / password!  plz tried again");
                /* call service_unauthorized()  -- general function to drop user from whatever they are accessing and bring to the login page */
                logout();
                return;
            }
            else {
                localStorage.setItem("currentUser", JSON.stringify(data));
                currentUserSubject.next(JSON.stringify(data));
                console.log(localStorage)
                return;
            }
        })
     }

function logout(): void {
    /* remove any token / current user in the session storage */
    localStorage.clear();
    /* somehow let the app know to re-render the LOGIN page */

}

function authHeader() {
    /* returns HTTP authorization header containing the JWT auth token of 
    * the currently logged-in user.  if user isn't logged in, returns an 
    * empty object instead */
   const currentUser = authService.currentUserValue;
   if (currentUser && currentUser.token) {
       return { Authorization: `Bearer ${currentUser.token}` };
   }
   else {
       return {};
   }
}