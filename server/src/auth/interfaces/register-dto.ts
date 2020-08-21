/* the form of the data that will be passed when handling a user
 * registration */

 // wrong..  auth/register route takes username and hash
export interface namePassDto {
    username: string;
    password: string;
};
