/* the form of the data that will be passed when interacting with the users
 *  db.  the id field is probably unnecessary since it's auto-generated! */
export interface userDto {
    id?: number;
    username: string;
    hash: string;
    cash?: number
}