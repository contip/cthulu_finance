import * as React from 'react';
import './hello.css';

export interface Properties {
    name: string;
    enthusiasmLevel?: number;
}

function Hello({ name, enthusiasmLevel = 1 }: Properties) {
    if (enthusiasmLevel <= 0) {
        throw new Error('your lack of enthusiasm has crashed the program!');
    }

    return (
        <div className="hello">
            <div className="greeting">
                Hello {name + getExclamationMarks(enthusiasmLevel)}
            </div>
        </div>
    );
}

export default Hello;

//helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}
