import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Button } from "@material-ui/core";

interface IForm {
    onSubmit: (event: React.FormEvent<any>) => void;
    inputs: Array<IFormInput>;
    buttonValidators: Array<boolean>;
}

interface IFormInput {
  label: string;
  value: string;
  type?: string | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void /* function to update the state of input field */;
  name: string;
  validatorListener: (isValid: boolean) => void | undefined;
  validators: Array<string>;
  errorMessages: Array<string>;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
}

export default function InputForm(props: IForm) {
  let textInputs = [];
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
        onBlur={props.inputs[i].onBlur ? props.inputs[i].onBlur : undefined}
        variant="outlined"
      />
    );
  }

  return (
    <>
      <ValidatorForm
        onSubmit={props.onSubmit}
        onError={(errors) => {
          console.log(errors);
        }}
      >
          {textInputs}
          
        {props.buttonValidators.every(Boolean) && <Button type="submit">Submit</Button> }

      </ValidatorForm>
    </>
  );
}
