/* the form of the data that will be passed when handling a user
 * registration */
export interface registerDto {
    username: string;
    password: string;
}

 // wrong..  auth/register route takes username and hash
export interface namePassDto {
    username: string;
    password: string;
};
