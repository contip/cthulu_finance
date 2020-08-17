import * as React from "react";
import { authService } from "./auth.service";
import { render } from "@testing-library/react";
import { useHistory } from 'react-router-dom';

export default function LogoutButton() {
    let history = useHistory();
    const handleSubmit = (event: React.MouseEvent) => {
        authService.logout();
        history.push('/login')
    }
    return(
        <div>
            <button onClick={handleSubmit}>Logout!</button>
        </div>
    )

    }
