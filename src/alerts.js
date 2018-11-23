import React, { Component } from 'react';

function SuccessAlert(props) {
    let className = "alert alert-success";
    return (
        <div className={className} role="alert">
            {props.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

function DangerAlert(props) {
    return (
        <div className="alert alert-danger" role="alert">
            {props.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export {SuccessAlert, DangerAlert};