import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Button } from "@material-ui/core";
import { IForm } from "../data/interfaces";

/* combination of mui submit button and validator input field */
export default function InputForm(props: IForm): JSX.Element {
  let textInputs = [];
  /* prepare desired number of validated input fields w/ options from props */
  for (let i = 0; i < props.inputs.length; i++) {
    textInputs.push(
      <TextValidator
        key={props.inputs[i].name}
        name={props.inputs[i].name}
        label={props.inputs[i].label}
        value={props.inputs[i].value}
        type={props.inputs[i].type ? props.inputs[i].type : undefined}
        onChange={props.inputs[i].onChange}
        validatorListener={props.inputs[i].validatorListener}
        validators={props.inputs[i].validators}
        errorMessages={props.inputs[i].errorMessages}
        disabled={props.inputs[i].disabled}
        onBlur={props.inputs[i].onBlur ? props.inputs[i].onBlur : undefined}
        variant="outlined"
      />
    );
  }

  return (
    <>
      {/* add text fields to validator form along with submit button (handler
       * functions provided by input props */}
      <ValidatorForm
        onSubmit={props.onSubmit}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        {textInputs}
        {/* hide button (but continue to take up space in DOM) if all given
          * validity checks do not pass */}
        <Button
          disableElevation
          variant="contained"
          color="primary"
          style={{
            marginBottom: "10px",
            
            visibility: props.buttonValidators.every(Boolean)
              ? "visible"
              : "hidden",
          }}
          type="submit"
        >
          Submit
        </Button>
      </ValidatorForm>
    </>
  );
}
