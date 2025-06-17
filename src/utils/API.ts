import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { getOS } from './utils';
// import { userInfo } from 'os';
import { useNavigate } from "react-router-dom";


// const API = (method: any, url: any, data: any, callback: any, failback: any, token: any) => {

//     let parameter = '';
//     if (method === 'get') {
//         parameter += '?';
//         for (const key in data) {
//             parameter += '&' + key + '=' + data[key];
//         }
//     }
//     axios({
//         method: method,
//         url: api + url + parameter,
//         timeout: 60000, // 60 seconds timeout
//         data: method === 'get' ? {} : { source: getOS(), ...data },
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json;charset=UTF-8',
//             Authorization: 'Bearer ' + (token ? token : ''),
//         },
//     })
//         .then((response) => {
//             const data = response.data;
//             if (response.status === 200 || response.status === 201) {
//                 callback(data? data : response.status);
//             } else if (data.errors) {
//                 let errorString = '';
//                 const objectValues = Object.values(data.errors);
//                 objectValues.map((error) => {
//                     errorString = errorString + error + ', ';
//                 });
//                 failback(data.message);
//             } else {
//                 failback(data.message);
//             }
//         })
//         .catch((error) => {

//             if (error.response) {
            
//                 if (error.response.status === 401) {
                 
//                     localStorage.setItem('user', '[]');
//                     window.location.assign('/login');
//                 }
//                 let errorString = '';
//                 const objectValues = Object.values(error.response.data);
//                 objectValues.map((error) => {
//                     errorString = errorString + error + ', ';
//                     failback(errorString)

//                 });
//                 if(error.response?.data?.message){
//                     failback(error.response?.data.message)
                    
//                 }
//             }

//             if (error.status === 'ECONNABORTED' || error.code === 'ERR_NETWORK'){
//                 failback(`${error.message}, please try again`)
//             }
//         });
// };

// export default API;




const API = (method: any, url: any, data: any, callback: any, failback: any, token: any) => {
    // const api = 'http://127.0.0.1:8000/api/admin/';
    //    const api = 'https://api.bullageontech.com/api/user/'; 
        // const api = 'http://159.223.1.96/api/user/';
     const api = 'https://api.loatsadpromomedia.com/api/admin/';
        // const api = 'https://lostardapi.lagrev.net/api/admin/';
    

    let parameter = '';
    if (method === 'get') {
        parameter += '?';
        for (const key in data) {
            parameter += '&' + key + '=' + data[key];
        }
    }

    // Check if FormData is being used
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    console.log(isFormData);

    axios({
        method: method,
        url: api + url + parameter,
        timeout: 60000,
        data: method === 'get' ? {} : (isFormData ? data : { source: getOS(), ...data }),
        headers: {
            Accept: 'application/json',
            ...(isFormData
                ? {} // Let browser set Content-Type with boundary
                : { 'Content-Type': 'application/json;charset=UTF-8' }),
            Authorization: 'Bearer ' + (token ? token : ''),
        },
    })
    .then((response) => {
        const data = response.data;
        if (response.status === 200 || response.status === 201) {
            callback(data ?? response.status);
        } else if (data.errors) {
            let errorString = '';
            Object.values(data.errors).map((error) => {
                errorString += error + ', ';
            });
            failback(data.message);
        } else {
            failback(data.message);
        }
    })
    .catch((error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.setItem('user', '[]');
                window.location.assign('/login');
            }

            let errorString = '';
            const objectValues = Object.values(error.response.data);
            objectValues.map((error) => {
                errorString += error + ', ';
                failback(errorString);
            });

            if (error.response?.data?.message) {
                failback(error.response?.data.message);
            }
        }

        if (error.status === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
            failback(`${error.message}, please try again`);
        }
    });
};
export default API;