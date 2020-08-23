import React from 'react'
import { authService } from './auth.service'

export const Home = () => {

    /* */


    return (
        <div>
            <h1>Welcome {authService.currentUserValue.userData.username}</h1>
            <h4>Ur profile:</h4>            
        </div>
    )
}
