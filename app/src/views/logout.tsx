import { useHistory } from "react-router-dom";
import { authService } from "../components/auth.service";

/* logout "view" that react router can link to, but which renders nothing
 * and simply logs user out and refreshes the window (see helpers.tsx) */
export default function Logout() {
  let history = useHistory();
  authService.logout();
  /* attempt to reload in place (router will drop to login in all cases) */
  history.go(0);
  return null;
}
