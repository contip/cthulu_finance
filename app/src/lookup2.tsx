import React, { useState, useEffect, FormEvent } from "react";
import LookupApi2, { stockData } from "./lookup-api2";
import { TextField, Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

export default function Lookup2() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [changed, setChanged] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setChanged(true);
    setLookupInput(event.target.value);
    return;
  }

  //   function textInput() {
  //       return(

  //       )
  //   }
  async function handleSubmit(event: React.FormEvent<Element>): 
  Promise<stockData | null> {
      
    let response = await LookupApi2(lookupInput);
    if (!response) {
        alert(`Error retrieving stock quote!  Are you sure ${lookupInput}
        is a valid stock symbol?`);
        return null;
    }
    return response;

  }

  return (
    <>
      <p />
      <ValidatorForm
        //ref="form"
        onSubmit={handleSubmit} // only submits when all validations are passed
        onError={(errors) => {
          console.log(errors);
          //setValidInput(false);
        }}
      >
        <TextValidator
          label="Stock Symbol"
          onChange={handleChange}
          name="name" // server expects request in form "name": "<val>"
          validatorListener={setValidInput} // if input is currently invalid and displaying error message, set invalid state
          value={lookupInput}
          validators={[
            "required",
            "matchRegexp:^[A-Za-z]+$",
            "maxStringLength:4",
          ]}
          errorMessages={[
            "this field is required!",
            "alphabetical letters only!",
            "stock symbols have a 4 character maximum!",
          ]}
          variant="outlined"
        />

        {
          /* hide submit button unless text input is valid */
          changed && validInput && <Button type="submit">Submit</Button>
        }
      </ValidatorForm>
    </>
  );
}
