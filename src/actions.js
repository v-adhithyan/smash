import React, {Component} from 'react';
import agendaApi from './constants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


function DeleteAgenda(id) {
    let url = agendaApi + id + "/";
    confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to delete this ?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => doDeletion(url)
            },
            {
                label: 'No',
                onClick: () => {}
            }
        ]
    })
}

function doDeletion(url) {
    fetch(url, {
        crossDomain: true,
        method: 'DELETE'
    })
        .then(response => {
            if (response.status == 204) {
                alert("Delete success")
                window.location.href = "/"
            } else {
                alert("Delete failed. Please try again.")
            }
        })
        .catch(error => alert(error.message));
}
export default DeleteAgenda;