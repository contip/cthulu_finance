import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("currentUser") || "null"));

interface IFormInput {
  username: string;
  password: string;
}

export const authService = {
    login,
    logout,
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
                localStorage.setItem("token", response.access_token); 
                localStorage.setItem("currentUser", data.username);
                currentUserSubject.next(data.username);
                console.log(localStorage.token)
                return;
            }
        })
     }

function logout(): void {
    /* remove any token / current user in the session storage */
    localStorage.clear();
    /* somehow let the app know to re-render the LOGIN page */

}