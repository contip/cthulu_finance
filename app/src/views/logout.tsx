import * as React from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../components/auth.service";

export default function Logout() {
  let history = useHistory();
  authService.logout();
  history.go(0);
  return;
}
