import React from 'react';
import { ITrade } from './interfaces';
import { Urls } from './constants';

export default async function TradeApi(payload: ITrade) {
    let response: Response = await fetch(Urls[payload.type])


}