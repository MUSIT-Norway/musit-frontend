import * as React from 'react';

export const CheckBox = (props: {
        id: string, 
        checked: boolean,
        displayValue: string
        value: string
        })=> (     
        <div> 
            <label> 
                <input type="checkbox" id={props.id} checked={props.checked}  ></ input>
                {props.displayValue}
                </label>
        </div>
  
);

