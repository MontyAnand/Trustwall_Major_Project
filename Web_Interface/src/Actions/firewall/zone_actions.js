import axios from "axios";
import { ACTIVE_ZONES_LIST_ERROR, ACTIVE_ZONES_LIST_REQUEST, ACTIVE_ZONES_LIST_SUCCESS, CREATE_ZONE_ERROR, CREATE_ZONE_REQUEST, CREATE_ZONE_SUCCESS, DELETE_ZONE_ERROR, DELETE_ZONE_REQUEST, DELETE_ZONE_SUCCESS, FLUSH_ZONE_DATA, GET_DEFAULT_ZONE_ERROR, GET_DEFAULT_ZONE_REQUEST, GET_DEFAULT_ZONE_SUCCESS, SET_DEFAULT_ZONE_ERROR, SET_DEFAULT_ZONE_SUCCESS, SET_SELECTED_ZONE, ZONE_ADD_FORWARD_ERROR, ZONE_ADD_FORWARD_REQUEST, ZONE_ADD_FORWARD_SUCCESS, ZONE_ADD_ICMPBLOCK_ERROR, ZONE_ADD_ICMPBLOCK_REQUEST, ZONE_ADD_ICMPBLOCK_SUCCESS, ZONE_ADD_ICMPBLOCKINVERSION_ERROR, ZONE_ADD_ICMPBLOCKINVERSION_REQUEST, ZONE_ADD_ICMPBLOCKINVERSION_SUCCESS, ZONE_ADD_INTERFACE_ERROR, ZONE_ADD_INTERFACE_REQUEST, ZONE_ADD_INTERFACE_SUCCESS, ZONE_ADD_MASQUERADE_ERROR, ZONE_ADD_MASQUERADE_REQUEST, ZONE_ADD_MASQUERADE_SUCCESS, ZONE_ADD_PORT_ERROR, ZONE_ADD_PORT_REQUEST, ZONE_ADD_PORT_SUCCESS, ZONE_ADD_PROTOCOL_ERROR, ZONE_ADD_PROTOCOL_REQUEST, ZONE_ADD_PROTOCOL_SUCCESS, ZONE_ADD_SERVICE_ERROR, ZONE_ADD_SERVICE_REQUEST, ZONE_ADD_SERVICE_SUCCESS, ZONE_ADD_SOURCE_ERROR, ZONE_ADD_SOURCE_REQUEST, ZONE_ADD_SOURCE_SUCCESS, ZONE_ADD_SOURCEPORT_ERROR, ZONE_ADD_SOURCEPORT_REQUEST, ZONE_ADD_SOURCEPORT_SUCCESS, ZONE_GET_DESCRIPTION_ERROR, ZONE_GET_DESCRIPTION_REQUEST, ZONE_GET_DESCRIPTION_SUCCESS, ZONE_GET_SHORT_ERROR, ZONE_GET_SHORT_REQUEST, ZONE_GET_SHORT_SUCCESS, ZONE_GET_TARGET_ERROR, ZONE_GET_TARGET_REQUEST, ZONE_GET_TARGET_SUCCESS, ZONE_ICMPTYPES_LIST_ERROR, ZONE_ICMPTYPES_LIST_REQUEST, ZONE_ICMPTYPES_LIST_SUCCESS, ZONE_LIST_FORWARDPORTS_ERROR, ZONE_LIST_FORWARDPORTS_REQUEST, ZONE_LIST_FORWARDPORTS_SUCCESS, ZONE_LIST_ICMPBLOCKS_ERROR, ZONE_LIST_ICMPBLOCKS_REQUEST, ZONE_LIST_ICMPBLOCKS_SUCCESS, ZONE_LIST_INTERFACES_ERROR, ZONE_LIST_INTERFACES_REQUEST, ZONE_LIST_INTERFACES_SUCCESS, ZONE_LIST_PORTS_ERROR, ZONE_LIST_PORTS_REQUEST, ZONE_LIST_PORTS_SUCCESS, ZONE_LIST_PROTOCOLS_ERROR, ZONE_LIST_PROTOCOLS_REQUEST, ZONE_LIST_PROTOCOLS_SUCCESS, ZONE_LIST_SERVICES_ERROR, ZONE_LIST_SERVICES_REQUEST, ZONE_LIST_SERVICES_SUCCESS, ZONE_LIST_SOURCEPORTS_ERROR, ZONE_LIST_SOURCEPORTS_REQUEST, ZONE_LIST_SOURCEPORTS_SUCCESS, ZONE_LIST_SOURCES_ERROR, ZONE_LIST_SOURCES_REQUEST, ZONE_LIST_SOURCES_SUCCESS, ZONE_QUERY_FORWARD_ERROR, ZONE_QUERY_FORWARD_REQUEST, ZONE_QUERY_FORWARD_SUCCESS, ZONE_QUERY_ICMPBLOCKINVERSION_ERROR, ZONE_QUERY_ICMPBLOCKINVERSION_REQUEST, ZONE_QUERY_ICMPBLOCKINVERSION_SUCCESS, ZONE_QUERY_MASQUERADE_ERROR, ZONE_QUERY_MASQUERADE_REQUEST, ZONE_QUERY_MASQUERADE_SUCCESS, ZONE_REMOVE_FORWARD_ERROR, ZONE_REMOVE_FORWARD_REQUEST, ZONE_REMOVE_FORWARD_SUCCESS, ZONE_REMOVE_ICMPBLOCK_ERROR, ZONE_REMOVE_ICMPBLOCK_REQUEST, ZONE_REMOVE_ICMPBLOCK_SUCCESS, ZONE_REMOVE_ICMPBLOCKINVERSION_ERROR, ZONE_REMOVE_ICMPBLOCKINVERSION_REQUEST, ZONE_REMOVE_ICMPBLOCKINVERSION_SUCCESS, ZONE_REMOVE_INTERFACE_ERROR, ZONE_REMOVE_INTERFACE_REQUEST, ZONE_REMOVE_INTERFACE_SUCCESS, ZONE_REMOVE_MASQUERADE_ERROR, ZONE_REMOVE_MASQUERADE_REQUEST, ZONE_REMOVE_MASQUERADE_SUCCESS, ZONE_REMOVE_PORT_ERROR, ZONE_REMOVE_PORT_REQUEST, ZONE_REMOVE_PORT_SUCCESS, ZONE_REMOVE_PROTOCOL_ERROR, ZONE_REMOVE_PROTOCOL_REQUEST, ZONE_REMOVE_PROTOCOL_SUCCESS, ZONE_REMOVE_SERVICE_ERROR, ZONE_REMOVE_SERVICE_REQUEST, ZONE_REMOVE_SERVICE_SUCCESS, ZONE_REMOVE_SOURCE_ERROR, ZONE_REMOVE_SOURCE_REQUEST, ZONE_REMOVE_SOURCE_SUCCESS, ZONE_REMOVE_SOURCEPORT_ERROR, ZONE_REMOVE_SOURCEPORT_REQUEST, ZONE_REMOVE_SOURCEPORT_SUCCESS, ZONE_SERVICES_LIST_ERROR, ZONE_SERVICES_LIST_REQUEST, ZONE_SERVICES_LIST_SUCCESS, ZONE_SET_DESCRIPTION_ERROR, ZONE_SET_DESCRIPTION_REQUEST, ZONE_SET_DESCRIPTION_SUCCESS, ZONE_SET_SHORT_ERROR, ZONE_SET_SHORT_REQUEST, ZONE_SET_SHORT_SUCCESS, ZONE_SET_TARGET_ERROR, ZONE_SET_TARGET_REQUEST, ZONE_SET_TARGET_SUCCESS, ZONES_LIST_ERROR, ZONES_LIST_REQUEST, ZONES_LIST_SUCCESS } from "./actiontypes"
import { errorAction } from '../error_action';

const baseURL = process.env.URL;

export const getZones = () => {
    return (dispatch) => {
        dispatch({ type: ZONES_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_zones`).then(res => {
            if(res.data.message) {
                const zones = res.data.message.split(' ').map(zone => ({ zone }));
                dispatch({
                    type: ZONES_LIST_SUCCESS,
                    payload: zones,
                });
            }
            else {
                dispatch({
                    type: ZONES_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONES_LIST_ERROR, err));
        });
    }
}

export const getDefaultZone = () => {
    return (dispatch) => {
        dispatch({ type: GET_DEFAULT_ZONE_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_default_zone`).then(res => {
            dispatch({
                type: GET_DEFAULT_ZONE_SUCCESS,
                payload: res.data.message,
            });
        }).catch(err => {
            dispatch(errorAction(GET_DEFAULT_ZONE_ERROR, err));
        });
    }
}

export const setDefaultZone = (zone) => {
    return (dispatch) => {
        dispatch({ type: SET_DEFAULT_ZONE_SUCCESS });
        axios.put(`${baseURL}/firewall/firewall_zones/set_default_zone`, { zone }).then(res => {
            dispatch({ type: SET_DEFAULT_ZONE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(SET_DEFAULT_ZONE_ERROR, err));
        });
    }
}

export const getActiveZones = () => {
    return (dispatch) => {
        dispatch({ type: ACTIVE_ZONES_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_acvtive_zones`).then(res => {
            if(res.data.message) {
                const activeZones = res.data.message.split('\n').map(activeZone => ({ activeZone }));
                dispatch({
                    type: ACTIVE_ZONES_LIST_SUCCESS,
                    payload: activeZones,
                });
            }
            else {
                dispatch({
                    type: ACTIVE_ZONES_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ACTIVE_ZONES_LIST_ERROR, err));
        });
    }
}

export const getServicesList = () => {
    return (dispatch) => {
        dispatch({ type: ZONE_SERVICES_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_services/get_services`).then(res => {
            if(res.data.message) {
                const services = res.data.message.split(' ').map(service => ({ service }));
                dispatch({
                    type: ZONE_SERVICES_LIST_SUCCESS,
                    payload: services,
                });
            }
            else {
                dispatch({
                    type: ZONE_SERVICES_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_SERVICES_LIST_ERROR, err));
        });
    }
}

export const getICMPTypesList = () => {
    return (dispatch) => {
        dispatch({ type: ZONE_ICMPTYPES_LIST_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_icmptypes/get_icmptypes`).then(res => {
            if(res.data.message) {
                const icmptypes = res.data.message.split(' ').map(icmptype => ({ icmptype, checked: false }));
                dispatch({
                    type: ZONE_ICMPTYPES_LIST_SUCCESS,
                    payload: icmptypes,
                });
            }
            else {
                dispatch({
                    type: ZONE_ICMPTYPES_LIST_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_ICMPTYPES_LIST_ERROR, err));
        });
    }
}

export const setSelectedZone = (zone) => {
    return {
        type: SET_SELECTED_ZONE,
        payload: zone,
    };
}

export const getTarget = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_GET_TARGET_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_target`, { zone }).then(res => {
            dispatch({
                type: ZONE_GET_TARGET_SUCCESS,
                payload: res.data.message
            })
        }).catch(err => {
            dispatch(errorAction(ZONE_GET_TARGET_ERROR, err));
        });
    }
}

export const setTarget = (zone, target) => {
    return (dispatch) => {
        dispatch({ type: ZONE_SET_TARGET_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/set_target`, { zone, target }).then(res => {
            dispatch({ type: ZONE_SET_TARGET_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_SET_TARGET_ERROR, err));
        });
    }
}

export const getDescription = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_GET_DESCRIPTION_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_description`, { zone }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: ZONE_GET_DESCRIPTION_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: ZONE_GET_DESCRIPTION_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_GET_DESCRIPTION_ERROR, err));
        });
    }
}

export const setDescription = (zone, description) => {
    return (dispatch) => {
        dispatch({ type: ZONE_SET_DESCRIPTION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/set_description`, { zone, description }).then(res => {
            dispatch({ type: ZONE_SET_DESCRIPTION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_SET_DESCRIPTION_ERROR, err));
        });
    }
}

export const getShort = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_GET_SHORT_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/get_short`, { zone }).then(res => {
            if(res.data.message) {
                dispatch({
                    type: ZONE_GET_SHORT_SUCCESS,
                    payload: res.data.message,
                });
            }
            else {
                dispatch({
                    type: ZONE_GET_SHORT_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_GET_SHORT_ERROR, err));
        });
    }
}

export const setShort = (zone, short) => {
    return (dispatch) => {
        dispatch({ type: ZONE_SET_SHORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/set_short`, { zone, short }).then(res => {
            dispatch({ type: ZONE_SET_SHORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_SET_SHORT_ERROR, err));
        });
    }
}

export const queryICMPBlockInversion = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_QUERY_ICMPBLOCKINVERSION_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/query_icmpblockinversion`, { zone }).then(res => {
            dispatch({
                type: ZONE_QUERY_ICMPBLOCKINVERSION_SUCCESS,
                payload: res.data.message,
            });
        }).catch(err => {
            dispatch(errorAction(ZONE_QUERY_ICMPBLOCKINVERSION_ERROR, err));
        });
    }
}

export const addICMPBlockInversion = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_ICMPBLOCKINVERSION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_icmpblockinversion`, { zone }).then(res => {
            dispatch({ type: ZONE_ADD_ICMPBLOCKINVERSION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_ICMPBLOCKINVERSION_ERROR, err));
        });
    }
}

export const removeICMPBlockInversion = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_ICMPBLOCKINVERSION_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_icmpblockinversion`, { zone }).then(res => {
            dispatch({ type: ZONE_REMOVE_ICMPBLOCKINVERSION_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_ICMPBLOCKINVERSION_ERROR, err));
        });
    }
}

export const queryForward = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_QUERY_FORWARD_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/query_icmpblockinversion`, { zone }).then(res => {
            dispatch({
                type: ZONE_QUERY_FORWARD_SUCCESS,
                payload: res.data.message,
            });
        }).catch(err => {
            dispatch(errorAction(ZONE_QUERY_FORWARD_ERROR, err));
        });
    }
}

export const addForward = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_FORWARD_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_icmpblockinversion`, { zone }).then(res => {
            dispatch({ type: ZONE_ADD_FORWARD_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_FORWARD_ERROR, err));
        });
    }
}

export const removeForward = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_FORWARD_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_icmpblockinversion`, { zone }).then(res => {
            dispatch({ type: ZONE_REMOVE_FORWARD_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_FORWARD_ERROR, err));
        });
    }
}

export const listInterfaces = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_INTERFACES_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_interfaces`, { zone }).then(res => {
            if(res.data.message) {
                const interfaces = res.data.message.split(' ').map(Interface => ({ Interface }));
                dispatch({
                    type: ZONE_LIST_INTERFACES_SUCCESS,
                    payload: interfaces,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_INTERFACES_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_INTERFACES_ERROR, err));
        });
    }
}

export const addInterface = (zone, Interface) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_INTERFACE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_interface`, { zone, Interface }).then(res => {
            dispatch({ type: ZONE_ADD_INTERFACE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_INTERFACE_ERROR, err));
        })
    }
}

export const removeInterface = (Interface) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_INTERFACE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_interface`, { Interface }).then(res => {
            dispatch({ type: ZONE_REMOVE_INTERFACE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_INTERFACE_ERROR, err));
        });
    }
}

export const listSources = (zone) => {
    return (dispatch) => {
        dispatch({ ZONE_LIST_SOURCES_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_sources`, { zone }).then(res => {
            if(res.data.message) {
                const sources = res.data.message.split(' ').map(source => {
                    if (source.startsWith("MAC:")) {
                        return { sourceType: "MAC", source: source.slice(4) };
                    } else if (source.startsWith("ipset:")) {
                        return { sourceType: "IPSet", source: source.slice(6) };
                    } else {
                        return { sourceType: "IP", source: source };
                    }
                });
                dispatch({
                    type: ZONE_LIST_SOURCES_SUCCESS,
                    payload: sources,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_SOURCES_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_SOURCES_ERROR, err));
        });
    }
}

export const addSource = (zone, source) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_SOURCE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_source`, { zone, source }).then(res => {
            dispatch({ type: ZONE_ADD_SOURCE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_SOURCE_ERROR, err));
        });
    }
}

export const removeSource = (source) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_SOURCE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_source`, { source }).then(res => {
            dispatch({ type: ZONE_REMOVE_SOURCE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_SOURCE_ERROR, err));
        })
    }
}

export const listServices = (zone) => {
    return (dispatch) => {
        dispatch({ ZONE_LIST_SERVICES_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_services`, { zone }).then(res => {
            if(res.data.message) {
                const services = res.data.message.split(' ').map(service => ({ service }));
                dispatch({
                    type: ZONE_LIST_SERVICES_SUCCESS,
                    payload: services,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_SERVICES_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_SERVICES_ERROR, err));
        });
    }
}

export const addService = (zone, service) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_SERVICE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_service`, { zone, service }).then(res => {
            dispatch({ type: ZONE_ADD_SERVICE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_SERVICE_ERROR, err));
        });
    }
}

export const removeService = (source, service) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_SERVICE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_service`, { source, service }).then(res => {
            dispatch({ type: ZONE_REMOVE_SERVICE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_SERVICE_ERROR, err));
        })
    }
}

export const listPorts = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_PORTS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_ports`, { zone }).then(res => {
            if(res.data.message) {
                const ports = res.data.message.split(' ').map(entry => {
                    const [port, protocol] = entry.split('/');
                    return {port, protocol};
                });
                dispatch({
                    type: ZONE_LIST_PORTS_SUCCESS,
                    payload: ports,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_PORTS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_PORTS_ERROR, err));
        });
    }
}

export const addPort = (zone, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_PORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_port`, { zone, port, protocol }).then(res => {
            dispatch({ type: ZONE_ADD_PORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_PORT_ERROR, err));
        });
    }
}

export const removePort = (zone, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_PORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_port`, { zone, port, protocol }).then(res => {
            dispatch({ type: ZONE_REMOVE_PORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_PORT_ERROR, err));
        });
    }
}

export const listProtocols = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_PROTOCOLS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_protocols`, { zone }).then(res => {
            if(res.data.message) {
                const protocols = res.data.message.split(' ').map(protocol => ({ protocol }));
                dispatch({
                    type: ZONE_LIST_PROTOCOLS_SUCCESS,
                    payload: protocols,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_PROTOCOLS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_PROTOCOLS_ERROR, err));
        });
    }
}

export const addProtocol = (zone, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_PROTOCOL_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_protocol`, { zone, protocol }).then(res => {
            dispatch({ type: ZONE_ADD_PROTOCOL_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_PROTOCOL_ERROR, err));
        });
    }
}

export const removeProtocol = (zone, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_PROTOCOL_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_protocol`, { zone, protocol }).then(res => {
            dispatch({ type: ZONE_REMOVE_PROTOCOL_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_PROTOCOL_ERROR, err));
        });
    }
}

export const listSourcePorts = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_SOURCEPORTS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_sourceports`, { zone }).then(res => {
            if(res.data.message) {
                const ports = res.data.message.split(' ').map(entry => {
                    const [port, protocol] = entry.split('/');
                    return {port, protocol};
                });
                dispatch({
                    type: ZONE_LIST_SOURCEPORTS_SUCCESS,
                    payload: ports,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_SOURCEPORTS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_SOURCEPORTS_ERROR, err));
        });
    }
}

export const addSourcePort = (zone, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_SOURCEPORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_sourceport`, { zone, port, protocol }).then(res => {
            dispatch({ type: ZONE_ADD_SOURCEPORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_SOURCEPORT_ERROR, err));
        });
    }
}

export const removeSourcePort = (zone, port, protocol) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_SOURCEPORT_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_sourceport`, { zone, port, protocol }).then(res => {
            dispatch({ type: ZONE_REMOVE_SOURCEPORT_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_SOURCEPORT_ERROR, err));
        });
    }
}

export const listICMPBlocks = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_ICMPBLOCKS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_icmpblocks`, { zone }).then(res => {
            if(res.data.message) {
                const icmptypes = res.data.message.split(' ').map(icmptype => ({ icmptype }));
                dispatch({
                    type: ZONE_LIST_ICMPBLOCKS_SUCCESS,
                    payload: icmptypes,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_ICMPBLOCKS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_ICMPBLOCKS_ERROR, err));
        });
    }
}

export const addICMPBlock = (zone, icmptype) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_ICMPBLOCK_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_icmpblock`, { zone, icmptype }).then(res => {
            dispatch({ type: ZONE_ADD_ICMPBLOCK_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_ICMPBLOCK_ERROR, err));
        });
    }
}

export const removeICMPBlock = (zone, icmptype) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_ICMPBLOCK_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_icmpblock`, { zone, icmptype }).then(res => {
            dispatch({ type: ZONE_REMOVE_ICMPBLOCK_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_ICMPBLOCK_ERROR, err));
        });
    }
}

export const listForwardPorts = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_LIST_FORWARDPORTS_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/list_forwardports`, { zone }).then(res => {
            if(res.data.message) {
                const forwardPorts = res.data.message.split('\n').map(forwardPort => {
                    const [port, protocol, toPort, toAddress] = forwardPort.split(':');
                    return { port, protocol, toPort, toAddress };
                });
                dispatch({
                    type: ZONE_LIST_FORWARDPORTS_SUCCESS,
                    payload: forwardPorts,
                });
            }
            else {
                dispatch({
                    type: ZONE_LIST_FORWARDPORTS_SUCCESS,
                    payload: '',
                });
            }
        }).catch(err => {
            dispatch(errorAction(ZONE_LIST_FORWARDPORTS_ERROR, err));
        });
    }
}

export const addForwardPort = (zone, port, protocol, toPort, toAddress) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_FORWARD_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_forwardport`, { zone, port, protocol, toPort, toAddress }).then(res => {
            dispatch({ ZONE_ADD_FORWARD_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_FORWARD_ERROR, err));
        });
    }
}

export const removeForwardPort = (zone, port, protocol, toPort, toAddress) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_FORWARD_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_forwardport`, { zone, port, protocol, toPort, toAddress }).then(res => {
            dispatch({ ZONE_REMOVE_FORWARD_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_FORWARD_ERROR, err));
        });
    }
}

export const queryMasquerade = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_QUERY_MASQUERADE_REQUEST });
        axios.get(`${baseURL}/firewall/firewall_zones/query_masquerade`, { zone }).then(res => {
            dispatch({
                type: ZONE_QUERY_MASQUERADE_SUCCESS,
                payload: res.data.message,
            });
        }).catch(err => {
            dispatch(errorAction(ZONE_QUERY_MASQUERADE_ERROR, err));
        });
    }
}

export const addMasquerade = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_ADD_MASQUERADE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/add_masquerade`, { zone }).then(res => {
            dispatch({ ZONE_ADD_MASQUERADE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_ADD_MASQUERADE_ERROR, err));
        });
    }
}

export const removeMasquerade = (zone) => {
    return (dispatch) => {
        dispatch({ type: ZONE_REMOVE_MASQUERADE_REQUEST });
        axios.put(`${baseURL}/firewall/firewall_zones/remove_masquerade`, { zone }).then(res => {
            dispatch({ type: ZONE_REMOVE_MASQUERADE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(ZONE_REMOVE_MASQUERADE_ERROR, err));
        });
    }
}

export const createZone = (zone) => {
    return (dispatch) => {
        dispatch({ type: CREATE_ZONE_REQUEST });
        axios.post(`${baseURL}/firewall/firewall_zones/new_zone`, { zone }).then(res => {
            dispatch({ type: CREATE_ZONE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(CREATE_ZONE_ERROR, err));
        });
    }
}

export const deleteZone = (zone) => {
    return (dispatch) => {
        dispatch({ type: DELETE_ZONE_REQUEST });
        axios.delete(`${baseURL}/firewall/firewall_zones/delete_zone`, { zone }).then(res => {
            dispatch({ type: DELETE_ZONE_SUCCESS });
        }).catch(err => {
            dispatch(errorAction(DELETE_ZONE_ERROR, err));
        });
    }
}

export const flushZoneData = () => {
    return {
        type: FLUSH_ZONE_DATA,
    };
}