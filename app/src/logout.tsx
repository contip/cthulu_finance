import * as React from "react";
import { authService } from "./auth.service";
import { render } from "@testing-library/react";

export default function logoutButton() {
    const handleSubmit = (event: React.MouseEvent) => {
        authService.logout();
    }
    return(
        <div>
            <button onClick={handleSubmit}>Logout!</button>
        </div>
    )

    }
