import React from "react";
import { authService } from "./auth.service";

export const Home = () => {
  /* */
    console.log('current state of localstorage is:', localStorage);
    console.log('current state of authservice.currentuservalue is:', authService.currentUserValue);

  function holdingz() {
    let bung = authService.currentUserValue.holdings;
    console.log('bung is', bung);
    return bung.map((holding: any) => <li>{holding}</li>);
  }

  return (
    <div>
      <h1>Welcome {authService.currentUserValue.userData.username}</h1>
      <h4>Ur profile:</h4>
      {holdingz}
    </div>
  );
};
