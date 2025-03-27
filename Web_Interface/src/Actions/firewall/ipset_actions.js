import axios from "axios";
import { CREATE_IPSET_ERROR, CREATE_IPSET_REQUEST, CREATE_IPSET_SUCCESS, DELETE_IPSET_REQUEST, FLUSH_IPSET_DATA, IPSET_ADD_ENTRY_ERROR, IPSET_ADD_ENTRY_REQUEST, IPSET_ADD_ENTRY_SUCCESS, IPSET_GET_DESCRIPTION_ERROR, IPSET_GET_DESCRIPTION_REQUEST, IPSET_GET_DESCRIPTION_SUCCESS, IPSET_GET_ENTRIES_ERROR, IPSET_GET_ENTRIES_REQUEST, IPSET_GET_ENTRIES_SUCCESS, IPSET_GET_SHORT_ERROR, IPSET_GET_SHORT_REQUEST, IPSET_GET_SHORT_SUCCESS, IPSET_LIST_ERROR, IPSET_LIST_REQUEST, IPSET_LIST_SUCCESS, IPSET_REMOVE_ENTRY_ERROR, IPSET_REMOVE_ENTRY_REQUEST, IPSET_REMOVE_ENTRY_SUCCESS, IPSET_SET_DESCRIPTION_ERROR, IPSET_SET_DESCRIPTION_REQUEST, IPSET_SET_DESCRIPTION_SUCCESS, IPSET_SET_SHORT_ERROR, IPSET_SET_SHORT_REQUEST, IPSET_SET_SHORT_SUCCESS, IPSET_TYPES_LIST_ERROR, IPSET_TYPES_LIST_REQUEST, IPSET_TYPES_LIST_SUCCESS, SET_SELECTED_IPSET } from "./actiontypes"
import { errorAction } from "../error_action";

const baseURL = process.env.URL;

export const getIPsets = () => {
    return (dispatch) => {
        dispatch({ type: IPSET_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_ipsets/get_ipsets`).then(res => {
            if(res.data.message) {
                const ipsets = res.data.message.split(' ').map(ipset => ({ ipset }));
                dispatch({
                    type: IPSET_LIST_SUCCESS,
                    payload: ipsets,
                });
            }
            else {
                dispatch({
                    type: IPSET_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(IPSET_LIST_ERROR, err));
        });
    }
}

export const getIPSetTypes = () => {
    return (dispatch) => {
        dispatch({ type: IPSET_TYPES_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_ipsets/get_ipsettypes`).then(res => {
            if(res.data.message) {
                const ipsettypes = res.data.message.split(' ').map(ipsettype => ({ ipsettype }));
                dispatch({
                    type: IPSET_TYPES_LIST_SUCCESS,
                    payload: ipsettypes,
                });
            }
            else {
                dispatch({
                    type: IPSET_TYPES_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(IPSET_TYPES_LIST_ERROR, err));
        });
    }
}

export const setSelectedIPSet = (ipset) => {
    return {
        type: SET_SELECTED_IPSET,
        payload: ipset,
    };
}

export const getDescription = (ipset) => {
    return (dispatch) => {
        dispatch({ type: IPSET_GET_DESCRIPTION_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_ipsets/get_description`, { ipset }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: IPSET_GET_DESCRIPTION_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: IPSET_GET_DESCRIPTION_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(IPSET_GET_DESCRIPTION_ERROR, err));
        });
    }
}

export const setDescription = (ipset, description) => {
    return (dispatch) => {
        dispatch({ type: IPSET_SET_DESCRIPTION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_ipsets/set_description`, { ipset, description }).then(res => {
            dispatch({ type: IPSET_SET_DESCRIPTION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(IPSET_SET_DESCRIPTION_ERROR, err));
        });
    }
}

export const getShort = (ipset) => {
    return (dispatch) => {
        dispatch({ type: IPSET_GET_SHORT_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_ipsets/get_short`, { ipset }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: IPSET_GET_SHORT_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: IPSET_GET_SHORT_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(IPSET_GET_SHORT_ERROR, err));
        });
    }
}

export const setShort = (ipset, short) => {
    return (dispatch) => {
        dispatch({ type: IPSET_SET_SHORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_ipsets/set_short`, { ipset, short }).then(res => {
            dispatch({ type: IPSET_SET_SHORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(IPSET_SET_SHORT_ERROR, err));
        });
    }
}

export const getEntries = (ipset) => {
    return (dispatch) => {
        dispatch({ type: IPSET_GET_ENTRIES_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_ipsets/get_entries`, { ipset }).then(res => {
            if(res.data.message) {
                const entries = res.data.message.split(' ').map(entry => ({ entry }));
                dispatch({
                    type: IPSET_GET_ENTRIES_SUCCESS,
                    payload: entries,
                });
            }
            else {
                dispatch({
                    type: IPSET_GET_ENTRIES_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(IPSET_GET_ENTRIES_ERROR, err));
        });
    }
}

export const addEntry = (ipset, entry) => {
    return (dispatch) => {
        dispatch({ IPSET_ADD_ENTRY_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_ipsets/add_entry`, { ipset, entry }).then(res => {
            dispatch({ type: IPSET_ADD_ENTRY_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(IPSET_ADD_ENTRY_ERROR, err));
        });
    }
}

export const removeEntry = (ipset, entry) => {
    return (dispatch) => {
        dispatch({ IPSET_REMOVE_ENTRY_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_ipsets/remove_entry`, { ipset, entry }).then(res => {
            dispatch({ type: IPSET_REMOVE_ENTRY_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(IPSET_REMOVE_ENTRY_ERROR, err));
        });
    }
}

export const createIPSet = (ipset, type, family, option) => {
    return (dispatch) => {
        dispatch({ type: CREATE_IPSET_REQUEST });
        axios.post(`${baseURL}/firewall/firewall_ipsets/new_ipset`, { ipset, type, family, option }).then(res => {
            dispatch({ CREATE_IPSET_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(CREATE_IPSET_ERROR, err));
        });
    }
}

export const deleteIPSet = (ipset) => {
    return (dispatch) => {
        dispatch({ type: DELETE_IPSET_REQUEST });
        axios.post(`${baseURL}/firewall/firewall_ipsets/delete_ipset`, { ipset }).then(res => {
            dispatch({ CREATE_IPSET_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(CREATE_IPSET_ERROR, err));
        });
    }
}

export const flushIPSetData = () => {
    return {
        type: FLUSH_IPSET_DATA,
    }
}