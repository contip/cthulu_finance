import React, { useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';



export default function Alert  (props: {onConfirm: ()=>void, confirmBtnText: string, title: string,
onCancel: ()=>void, message: string}) {

  let myAlert = (
    <SweetAlert
    warning
    showCancel
    onConfirm={props.onConfirm}
    confirmBtnText={props.confirmBtnText}
    confirmBtnBsStyle="danger"
    title={props.title}
    onCancel={props.onCancel}
    focusCancelBtn>
      {props.message}
    </SweetAlert>
  )
  return (
    <>
    {props.message && props.confirmBtnText && props.onCancel && props.onConfirm && props.title ?
    myAlert : null}

    </>


  )
}