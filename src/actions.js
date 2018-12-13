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

function EditAgenda(id, data) {
    let url = agendaApi + id + "/";
    confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to edit this ?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => patchAgenda(url, data)
            },
            {
                label: 'No',
                onClick: () => { }
            }
        ]
    })
}

function patchAgenda(url, data) {
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        crossDomain: true,
        method: 'PATCH',
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 204) {
                alert("Edit success")
                window.location.href = "/"
            } else {
                alert("Edit failed. Please try again.")
            }
        })
        .catch(error => alert(error.message));
}

function getAgenda(url, id) {

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
