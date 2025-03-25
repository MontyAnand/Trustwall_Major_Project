import axios from "axios";
import { POLICY_LIST_ERROR, POLICY_LIST_REQUEST, POLICY_LIST_SUCCESS } from "./actiontypes"

const baseURL = process.env.URL;

export const getPolicies = () => {
    return (dispatch) => {
        dispatch({ type: POLICY_LIST_REQUEST });
        axios(`${baseURL}/firewall/firewall_policies/get_policies`).then(res => {
            if(res.data.message) {
                const policies = res.data.message.split(' ').map(policy => ({ policy }));
                dispatch({
                    type: POLICY_LIST_SUCCESS,
                    payload: policies,
                });
            }
            else {
                dispatch({
                    type: POLICY_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch({
                type: POLICY_LIST_ERROR,
                payload: {
                    type: POLICY_LIST_ERROR,
                    payload: err,
                },
            });
        })
    }
}