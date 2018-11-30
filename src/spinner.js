import React, { Component } from 'react';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';


function Spinner(props) {
    return (
        <div className='loading-spinner'>
            <center>
                <ClipLoader
                    className={css}
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={props.loading}
                />
            </center>
        </div> 
    )
}

export default Spinner;