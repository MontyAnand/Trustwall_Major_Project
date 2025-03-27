import axios from "axios";
import { CREATE_SERVICE_ERROR, CREATE_SERVICE_REQUEST, CREATE_SERVICE_SUCCESS, DELETE_SERVICE_ERROR, DELETE_SERVICE_REQUEST, DELETE_SERVICE_SUCCESS, FLUSH_SERVICE_DATA, SERVICE_ADD_PORT_ERROR, SERVICE_ADD_PORT_REQUEST, SERVICE_ADD_PORT_SUCCESS, SERVICE_ADD_PROTOCOL_ERROR, SERVICE_ADD_PROTOCOL_REQUEST, SERVICE_ADD_PROTOCOL_SUCCESS, SERVICE_ADD_SOURCEPORT_ERROR, SERVICE_ADD_SOURCEPORT_REQUEST, SERVICE_ADD_SOURCEPORT_SUCCESS, SERVICE_GET_DESCRIPTION_ERROR, SERVICE_GET_DESCRIPTION_REQUEST, SERVICE_GET_DESCRIPTION_SUCCESS, SERVICE_GET_DESTINATIONS_ERROR, SERVICE_GET_DESTINATIONS_REQUEST, SERVICE_GET_DESTINATIONS_SUCCESS, SERVICE_GET_PORTS_ERROR, SERVICE_GET_PORTS_REQUEST, SERVICE_GET_PORTS_SUCCESS, SERVICE_GET_PROTOCOLS_ERROR, SERVICE_GET_PROTOCOLS_REQUEST, SERVICE_GET_PROTOCOLS_SUCCESS, SERVICE_GET_SHORT_ERROR, SERVICE_GET_SHORT_REQUEST, SERVICE_GET_SHORT_SUCCESS, SERVICE_GET_SOURCEPORTS_ERROR, SERVICE_GET_SOURCEPORTS_REQUEST, SERVICE_GET_SOURCEPORTS_SUCCESS, SERVICE_LIST_ERROR, SERVICE_LIST_REQUEST, SERVICE_LIST_SUCCESS, SERVICE_REMOVE_DESTINATION_ERROR, SERVICE_REMOVE_DESTINATION_REQUEST, SERVICE_REMOVE_DESTINATION_SUCCESS, SERVICE_REMOVE_PORT_ERROR, SERVICE_REMOVE_PORT_REQUEST, SERVICE_REMOVE_PORT_SUCCESS, SERVICE_REMOVE_PROTOCOL_ERROR, SERVICE_REMOVE_PROTOCOL_REQUEST, SERVICE_REMOVE_PROTOCOL_SUCCESS, SERVICE_REMOVE_SOURCEPORT_ERROR, SERVICE_REMOVE_SOURCEPORT_REQUEST, SERVICE_REMOVE_SOURCEPORT_SUCCESS, SERVICE_SET_DESCRIPTION_ERROR, SERVICE_SET_DESCRIPTION_REQUEST, SERVICE_SET_DESCRIPTION_SUCCESS, SERVICE_SET_DESTINATION_ERROR, SERVICE_SET_DESTINATION_REQUEST, SERVICE_SET_DESTINATION_SUCCESS, SERVICE_SET_SHORT_ERROR, SERVICE_SET_SHORT_REQUEST, SET_SELECTED_SERVICE, ZONE_GET_DESCRIPTION_REQUEST } from "./actiontypes"
import { errorAction } from "../error_action";

const baseURL = process.env.URL;

export const getServices = () => {
    return (dispatch) => {
        dispatch({ type: SERVICE_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_services`).then(res => {
            if(res.data.message) {
                const services = res.data.message.split(' ').map(service => ({ service }));
                dispatch({
                    type: SERVICE_LIST_SUCCESS,
                    payload: services,
                });
            }
            else {
                dispatch({
                    type: SERVICE_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_LIST_ERROR, err));
        })
    }
}

export const setSelectedService = (service) => {
    return {
        type: SET_SELECTED_SERVICE,
        payload: service,
    };
}

export const getDescription = (service) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_GET_DESCRIPTION_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_description`, { service }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: SERVICE_GET_DESCRIPTION_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_DESCRIPTION_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_DESCRIPTION_ERROR, err));
        });
    }
}

export const setDescription = (service, description) => {
    return (dispatch) => {
        dispatch({ SERVICE_SET_DESCRIPTION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/set_description`, { service, description }).then(res => {
            dispatch({ type: SERVICE_SET_DESCRIPTION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_SET_DESCRIPTION_ERROR, err));
        });
    }
}

export const getShort = (service) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_GET_SHORT_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_short`, { service }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: SERVICE_GET_SHORT_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_SHORT_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_SHORT_ERROR, err));
        });
    }
}

export const setShort = (service, short) => {
    return (dispatch) => {
        dispatch({ SERVICE_SET_SHORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/set_short`, { service, short }).then(res => {
            dispatch({ type: SERVICE_SET_SHORT_REQUEST });
        }).catch(err => {
            dispatch(errorAction(SERVICE_SET_SHORT_ERROR, err));
        });
    }
}

export const getPorts = (service) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_GET_PORTS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_ports`, { service }).then(res => {
            if(res.data.message) {
                const ports = res.data.message.split(' ').map(entry => {
                    const [port, protocol] = entry.split('/');
                    return { port, protocol };
                });
                dispatch({
                    type: SERVICE_GET_PORTS_SUCCESS,
                    payload: ports,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_PORTS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_PORTS_ERROR, err));
        });
    }
}

export const addPort = (service, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_ADD_PORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/add_port`, { service, port, protocol }).then(res => {
            dispatch({ type: SERVICE_ADD_PORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_ADD_PORT_ERROR, err));
        });
    }
}

export const removePort = (service, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_REMOVE_PORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/remove_port`, { service, port, protocol }).then(res => {
            dispatch({ type: SERVICE_REMOVE_PORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_REMOVE_PORT_ERROR, err));
        });
    }
}

export const getProtocols = (service) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_GET_PROTOCOLS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_protocols`, { service }).then(res => {
            if(res.data.message) {
                const protocols = res.data.message.split(' ').map(protocol => ({ protocol }));
                dispatch({
                    type: SERVICE_GET_PROTOCOLS_SUCCESS,
                    payload: protocols,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_PROTOCOLS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_PROTOCOLS_ERROR, err));
        });
    }
}

export const addProtocol = (service, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_ADD_PROTOCOL_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/add_protocol`, { service, protocol }).then(res => {
            dispatch({ type: SERVICE_ADD_PROTOCOL_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_ADD_PROTOCOL_ERROR, err));
        });
    }
}

export const removeProtocol = (service, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_REMOVE_PROTOCOL_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/remove_protocol`, { service, protocol }).then(res => {
            dispatch({ type: SERVICE_REMOVE_PROTOCOL_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_REMOVE_PROTOCOL_ERROR, err));
        });
    }
}

export const getSourcePorts = (service) => {
    return (dispatch) => {
        dispatch({ SERVICE_GET_SOURCEPORTS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_sourceports`, { service }).then(res => {
            if(res.data.message) {
                const sourcePorts = res.data.message.split(' ').map(sourcePort => {
                    const [port, protocol] = sourcePort.split('/');
                    return { port, protocol };
                });
                dispatch({
                    type: SERVICE_GET_SOURCEPORTS_SUCCESS,
                    payload: sourcePorts,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_SOURCEPORTS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_SOURCEPORTS_ERROR, err));
        });
    }
}

export const addSourcePort = (service, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_ADD_SOURCEPORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/add_sourceport`, { service , port, protocol }).then(res => {
            dispatch({ type: SERVICE_ADD_SOURCEPORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_ADD_SOURCEPORT_ERROR, err));
        });
    }
}

export const removeSourcePort = (service, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_REMOVE_SOURCEPORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/remove_sourceport`, { service , port, protocol }).then(res => {
            dispatch({ type: SERVICE_REMOVE_SOURCEPORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_REMOVE_SOURCEPORT_ERROR, err));
        });
    }
}

export const getDestinations = (service) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_GET_DESTINATIONS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_destinations`, { service }).then(res => {
            if(res.data.message) {
                const destinations = res.data.message.split(' ').map(destination => {
                    const ipv = destination.substring(0, 4);
                    const destinationAddress = destination.substring(5);
                    return { ipv, destinationAddress };
                });
                dispatch({
                    type: SERVICE_GET_DESTINATIONS_SUCCESS,
                    payload: destinations,
                });
            }
            else {
                dispatch({
                    type: SERVICE_GET_DESTINATIONS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(SERVICE_GET_DESTINATIONS_ERROR, err));
        });
    }
}

export const setDestination = (service, ipv, destinationAddress) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_SET_DESTINATION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/set_destination`, { service, ipv, destinationAddress }).then(res => {
            dispatch({ type: SERVICE_SET_DESTINATION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_SET_DESTINATION_ERROR, err));
        });
    }
}

export const removeDestination = (service, ipv) => {
    return (dispatch) => {
        dispatch({ type: SERVICE_REMOVE_DESTINATION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_services/remove_destination`, { service, ipv }).then(res => {
            dispatch({ type: SERVICE_REMOVE_DESTINATION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SERVICE_REMOVE_DESTINATION_ERROR, err));
        });
    }
}

export const createService = (service) => {
    return (dispatch) => {
        dispatch({ type: CREATE_SERVICE_REQUEST });
        axios.post(`${baseURL}/firewall/firewall_services/new_service`, { service }).then(res => {
            dispatch({ type: CREATE_SERVICE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(CREATE_SERVICE_ERROR, err));
        });
    }
}

export const deleteService = (service) => {
    return (dispatch) => {
        dispatch({ type: DELETE_SERVICE_REQUEST });
        axios.delete(`${baseURL}/firewall/firewall_services/delete_service`, { service }).then(res => {
            dispatch({ type: DELETE_SERVICE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(DELETE_SERVICE_ERROR, err));
        });
    }
}

export const flushServiceData = () => {
    return {
        type: FLUSH_SERVICE_DATA,
    }
}