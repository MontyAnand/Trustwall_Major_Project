import { ACTIVE_ZONES_LIST_ERROR, ACTIVE_ZONES_LIST_REQUEST, ACTIVE_ZONES_LIST_SUCCESS, CREATE_ZONE_ERROR, CREATE_ZONE_REQUEST, CREATE_ZONE_SUCCESS, DELETE_ZONE_ERROR, DELETE_ZONE_REQUEST, DELETE_ZONE_SUCCESS, FLUSH_ZONE_DATA, GET_DEFAULT_ZONE_ERROR, GET_DEFAULT_ZONE_REQUEST, GET_DEFAULT_ZONE_SUCCESS, SERVICE_GET_DESCRIPTION_REQUEST, SERVICE_GET_DESCRIPTION_SUCCESS, SET_DEFAULT_ZONE_ERROR, SET_DEFAULT_ZONE_REQUEST, SET_DEFAULT_ZONE_SUCCESS, SET_SELECTED_ZONE, ZONE_ADD_FORWARD_ERROR, ZONE_ADD_FORWARD_REQUEST, ZONE_ADD_FORWARD_SUCCESS, ZONE_ADD_FORWARDPORT_ERROR, ZONE_ADD_FORWARDPORT_REQUEST, ZONE_ADD_FORWARDPORT_SUCCESS, ZONE_ADD_ICMPBLOCK_ERROR, ZONE_ADD_ICMPBLOCK_REQUEST, ZONE_ADD_ICMPBLOCK_SUCCESS, ZONE_ADD_ICMPBLOCKINVERSION_ERROR, ZONE_ADD_ICMPBLOCKINVERSION_REQUEST, ZONE_ADD_ICMPBLOCKINVERSION_SUCCESS, ZONE_ADD_INTERFACE_ERROR, ZONE_ADD_INTERFACE_REQUEST, ZONE_ADD_INTERFACE_SUCCESS, ZONE_ADD_MASQUERADE_ERROR, ZONE_ADD_MASQUERADE_REQUEST, ZONE_ADD_MASQUERADE_SUCCESS, ZONE_ADD_PORT_ERROR, ZONE_ADD_PORT_REQUEST, ZONE_ADD_PORT_SUCCESS, ZONE_ADD_PROTOCOL_ERROR, ZONE_ADD_PROTOCOL_REQUEST, ZONE_ADD_PROTOCOL_SUCCESS, ZONE_ADD_SERVICE_ERROR, ZONE_ADD_SERVICE_REQUEST, ZONE_ADD_SERVICE_SUCCESS, ZONE_ADD_SOURCE_ERROR, ZONE_ADD_SOURCE_REQUEST, ZONE_ADD_SOURCE_SUCCESS, ZONE_ADD_SOURCEPORT_ERROR, ZONE_ADD_SOURCEPORT_REQUEST, ZONE_ADD_SOURCEPORT_SUCCESS, ZONE_GET_DESCRIPTION_ERROR, ZONE_GET_DESCRIPTION_REQUEST, ZONE_GET_DESCRIPTION_SUCCESS, ZONE_GET_SHORT_ERROR, ZONE_GET_SHORT_REQUEST, ZONE_GET_SHORT_SUCCESS, ZONE_GET_TARGET_ERROR, ZONE_GET_TARGET_REQUEST, ZONE_GET_TARGET_SUCCESS, ZONE_ICMPTYPES_LIST_ERROR, ZONE_ICMPTYPES_LIST_REQUEST, ZONE_ICMPTYPES_LIST_SUCCESS, ZONE_LIST_FORWARDPORTS_ERROR, ZONE_LIST_FORWARDPORTS_REQUEST, ZONE_LIST_FORWARDPORTS_SUCCESS, ZONE_LIST_ICMPBLOCKS_ERROR, ZONE_LIST_ICMPBLOCKS_REQUEST, ZONE_LIST_ICMPBLOCKS_SUCCESS, ZONE_LIST_INTERFACES_ERROR, ZONE_LIST_INTERFACES_REQUEST, ZONE_LIST_INTERFACES_SUCCESS, ZONE_LIST_PORTS_ERROR, ZONE_LIST_PORTS_REQUEST, ZONE_LIST_PORTS_SUCCESS, ZONE_LIST_PROTOCOLS_ERROR, ZONE_LIST_PROTOCOLS_REQUEST, ZONE_LIST_PROTOCOLS_SUCCESS, ZONE_LIST_SERVICES_ERROR, ZONE_LIST_SERVICES_REQUEST, ZONE_LIST_SERVICES_SUCCESS, ZONE_LIST_SOURCEPORTS_ERROR, ZONE_LIST_SOURCEPORTS_REQUEST, ZONE_LIST_SOURCEPORTS_SUCCESS, ZONE_LIST_SOURCES_ERROR, ZONE_LIST_SOURCES_REQUEST, ZONE_LIST_SOURCES_SUCCESS, ZONE_QUERY_FORWARD_ERROR, ZONE_QUERY_FORWARD_REQUEST, ZONE_QUERY_FORWARD_SUCCESS, ZONE_QUERY_ICMPBLOCKINVERSION_ERROR, ZONE_QUERY_ICMPBLOCKINVERSION_REQUEST, ZONE_QUERY_ICMPBLOCKINVERSION_SUCCESS, ZONE_QUERY_MASQUERADE_ERROR, ZONE_QUERY_MASQUERADE_REQUEST, ZONE_QUERY_MASQUERADE_SUCCESS, ZONE_REMOVE_FORWARD_ERROR, ZONE_REMOVE_FORWARD_REQUEST, ZONE_REMOVE_FORWARD_SUCCESS, ZONE_REMOVE_FORWARDPORT_ERROR, ZONE_REMOVE_FORWARDPORT_REQUEST, ZONE_REMOVE_FORWARDPORT_SUCCESS, ZONE_REMOVE_ICMPBLOCK_ERROR, ZONE_REMOVE_ICMPBLOCK_REQUEST, ZONE_REMOVE_ICMPBLOCK_SUCCESS, ZONE_REMOVE_ICMPBLOCKINVERSION_ERROR, ZONE_REMOVE_ICMPBLOCKINVERSION_REQUEST, ZONE_REMOVE_ICMPBLOCKINVERSION_SUCCESS, ZONE_REMOVE_INTERFACE_ERROR, ZONE_REMOVE_INTERFACE_REQUEST, ZONE_REMOVE_INTERFACE_SUCCESS, ZONE_REMOVE_MASQUERADE_ERROR, ZONE_REMOVE_MASQUERADE_REQUEST, ZONE_REMOVE_MASQUERADE_SUCCESS, ZONE_REMOVE_PORT_ERROR, ZONE_REMOVE_PORT_REQUEST, ZONE_REMOVE_PORT_SUCCESS, ZONE_REMOVE_PROTOCOL_ERROR, ZONE_REMOVE_PROTOCOL_REQUEST, ZONE_REMOVE_PROTOCOL_SUCCESS, ZONE_REMOVE_SERVICE_ERROR, ZONE_REMOVE_SERVICE_REQUEST, ZONE_REMOVE_SERVICE_SUCCESS, ZONE_REMOVE_SOURCE_ERROR, ZONE_REMOVE_SOURCE_REQUEST, ZONE_REMOVE_SOURCE_SUCCESS, ZONE_REMOVE_SOURCEPORT_ERROR, ZONE_REMOVE_SOURCEPORT_REQUEST, ZONE_REMOVE_SOURCEPORT_SUCCESS, ZONE_SERVICES_LIST_ERROR, ZONE_SERVICES_LIST_REQUEST, ZONE_SERVICES_LIST_SUCCESS, ZONE_SET_DESCRIPTION_ERROR, ZONE_SET_DESCRIPTION_REQUEST, ZONE_SET_DESCRIPTION_SUCCESS, ZONE_SET_SHORT_ERROR, ZONE_SET_SHORT_REQUEST, ZONE_SET_SHORT_SUCCESS, ZONE_SET_TARGET_ERROR, ZONE_SET_TARGET_REQUEST, ZONE_SET_TARGET_SUCCESS, ZONES_LIST_ERROR, ZONES_LIST_REQUEST, ZONES_LIST_SUCCESS } from "../../Actions/firewall/actiontypes"

const initialState = {
    zonesList: [],
    defaultZone: '',
    activeZones: [],
    zoneServicesList: [],
    zoneICMPTypesList: [],
    selectedZone: '',
    target: '',
    description: '',
    short: '',
    icmpBlockInversion: null,
    forward: null,
    interfaces: [],
    sources: [],
    services: [],
    ports: [],
    protocols: [],
    sourcePorts: [],
    icmpBlocks: [],
    forwardPorts: [],
    masquerading: null,
    richRules: [],
    isLoading: false,
    error: null,
};

const zoneReducer = (state=initialState, action) => {
    switch(action.type) {
        case ZONES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONES_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                zonesList: action.payload,
            };
        case ZONES_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case GET_DEFAULT_ZONE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_DEFAULT_ZONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                defaultZone: action.payload,
            };
        case GET_DEFAULT_ZONE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SET_DEFAULT_ZONE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SET_DEFAULT_ZONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SET_DEFAULT_ZONE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ACTIVE_ZONES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ACTIVE_ZONES_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                activeZones: action.payload,
            };
        case ACTIVE_ZONES_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_SERVICES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_SERVICES_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                zoneServicesList: action.payload,
            };
        case ZONE_SERVICES_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ICMPTYPES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ICMPTYPES_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                zoneICMPTypesList: action.payload,
            };
        case ZONE_ICMPTYPES_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SET_SELECTED_ZONE:
            return {
                ...state,
                selectedZone: action.payload,
            };
        case ZONE_GET_TARGET_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_GET_TARGET_SUCCESS:
            return {
                ...state,
                isLoading: false,
                target: action.payload,
            };
        case ZONE_GET_TARGET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case ZONE_SET_TARGET_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_SET_TARGET_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_SET_TARGET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_GET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_GET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                description: action.payload,
            };
        case ZONE_GET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_SET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_SET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_SET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_GET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_GET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                short: action.payload,
            };
        case ZONE_GET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_SET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_SET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_SET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_QUERY_ICMPBLOCKINVERSION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_QUERY_ICMPBLOCKINVERSION_SUCCESS:
            let icmpBlockInversion = false;
            if(action.payload === 'yes') icmpBlockInversion = true;
            else icmpBlockInversion = false;
            return {
                ...state,
                isLoading: false,
                icmpBlockInversion: icmpBlockInversion,
            };
        case ZONE_QUERY_ICMPBLOCKINVERSION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_ICMPBLOCKINVERSION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_ICMPBLOCKINVERSION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_ICMPBLOCKINVERSION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_ICMPBLOCKINVERSION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_ICMPBLOCKINVERSION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_ICMPBLOCKINVERSION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_QUERY_FORWARD_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_QUERY_FORWARD_SUCCESS:
            let forward = false;
            if(action.payload === 'yes') forward = true;
            else forward = false;
            return {
                ...state,
                isLoading: false,
                forward: forward,
            };
        case ZONE_QUERY_FORWARD_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_FORWARD_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_FORWARD_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_FORWARD_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_FORWARD_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_FORWARD_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_FORWARD_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_INTERFACES_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_INTERFACES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                interfaces: action.payload,
            };
        case ZONE_LIST_INTERFACES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_INTERFACE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_INTERFACE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_INTERFACE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_INTERFACE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_INTERFACE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_INTERFACE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_SOURCES_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_SOURCES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                sources: action.payload,
            };
        case ZONE_LIST_SOURCES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_SOURCE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_SOURCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_SOURCE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_SOURCE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_SOURCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_SOURCE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_SERVICES_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_SERVICES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                services: action.payload,
            };
        case ZONE_LIST_SERVICES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_SERVICE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_SERVICE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_SERVICE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_SERVICE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_SERVICE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_SERVICE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_PORTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_PORTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ports: action.payload,
            };
        case ZONE_LIST_PORTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_PORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_PORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_PORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_PORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_PORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_PORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_PROTOCOLS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_PROTOCOLS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                protocols: action.payload,
            };
        case ZONE_LIST_PROTOCOLS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_PROTOCOL_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_PROTOCOL_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_PROTOCOL_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_PROTOCOL_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_PROTOCOL_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_PROTOCOL_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_SOURCEPORTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_SOURCEPORTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                sourcePorts: action.payload,
            };
        case ZONE_LIST_SOURCEPORTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_SOURCEPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_SOURCEPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_SOURCEPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_SOURCEPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_SOURCEPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_SOURCEPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_ICMPBLOCKS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_ICMPBLOCKS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                icmpBlocks: action.payload,
            };
        case ZONE_LIST_ICMPBLOCKS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_ICMPBLOCK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_ICMPBLOCK_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_ICMPBLOCK_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_ICMPBLOCK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_ICMPBLOCK_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_ICMPBLOCK_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_LIST_FORWARDPORTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_LIST_FORWARDPORTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                forwardPorts: action.payload,
            };
        case ZONE_LIST_FORWARDPORTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_FORWARDPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_FORWARDPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_FORWARDPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_FORWARDPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_FORWARDPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_FORWARDPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_QUERY_MASQUERADE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_QUERY_MASQUERADE_SUCCESS:
            let masquerading = false;
            if(action.payload === 'yes') masquerading = true;
            else masquerading = false;
            return {
                ...state,
                isLoading: false,
                masquerading: masquerading,
            };
        case ZONE_QUERY_MASQUERADE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_ADD_MASQUERADE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_ADD_MASQUERADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_ADD_MASQUERADE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ZONE_REMOVE_MASQUERADE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ZONE_REMOVE_MASQUERADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case ZONE_REMOVE_MASQUERADE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case CREATE_ZONE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case CREATE_ZONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case CREATE_ZONE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case DELETE_ZONE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case DELETE_ZONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case DELETE_ZONE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case FLUSH_ZONE_DATA:
            return {
                ...initialState,
                zonesList: state.zonesList,
                defaultZone: state.defaultZone,
                activeZones: state.activeZones,
                zoneServicesList: state.zoneServicesList,
                zoneICMPTypesList: state.zoneICMPTypesList,
            };
        default:
            return state;
    }
}

export default zoneReducer;