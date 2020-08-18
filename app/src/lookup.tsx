import * as React from 'react';
import LogoutButton from './logout';
import LookupApi from './lookup-api';

export default function Lookup() {

    return(

        <React.Fragment>
            <div className="LookUpForm">
                <LookupApi />
            </div>
            {/* i will probably have the logout button in the navbar my dude */}
            <div className="LogoutButton">
                <LogoutButton />
            </div>
        </React.Fragment>
    )
    
}