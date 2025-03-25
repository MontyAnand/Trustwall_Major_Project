import { CREATE_SERVICE_ERROR, CREATE_SERVICE_REQUEST, CREATE_SERVICE_SUCCESS, DELETE_SERVICE_ERROR, DELETE_SERVICE_REQUEST, DELETE_SERVICE_SUCCESS, FLUSH_SERVICE_DATA, SERVICE_ADD_PORT_ERROR, SERVICE_ADD_PORT_REQUEST, SERVICE_ADD_PORT_SUCCESS, SERVICE_ADD_PROTOCOL_ERROR, SERVICE_ADD_PROTOCOL_REQUEST, SERVICE_ADD_PROTOCOL_SUCCESS, SERVICE_ADD_SOURCEPORT_ERROR, SERVICE_ADD_SOURCEPORT_REQUEST, SERVICE_ADD_SOURCEPORT_SUCCESS, SERVICE_GET_DESCRIPTION_ERROR, SERVICE_GET_DESCRIPTION_REQUEST, SERVICE_GET_DESCRIPTION_SUCCESS, SERVICE_GET_DESTINATIONS_ERROR, SERVICE_GET_DESTINATIONS_REQUEST, SERVICE_GET_DESTINATIONS_SUCCESS, SERVICE_GET_PORTS_ERROR, SERVICE_GET_PORTS_REQUEST, SERVICE_GET_PORTS_SUCCESS, SERVICE_GET_PROTOCOLS_ERROR, SERVICE_GET_PROTOCOLS_REQUEST, SERVICE_GET_PROTOCOLS_SUCCESS, SERVICE_GET_SHORT_ERROR, SERVICE_GET_SHORT_REQUEST, SERVICE_GET_SHORT_SUCCESS, SERVICE_GET_SOURCEPORTS_ERROR, SERVICE_GET_SOURCEPORTS_REQUEST, SERVICE_GET_SOURCEPORTS_SUCCESS, SERVICE_LIST_ERROR, SERVICE_LIST_REQUEST, SERVICE_LIST_SUCCESS, SERVICE_REMOVE_DESTINATION_ERROR, SERVICE_REMOVE_DESTINATION_REQUEST, SERVICE_REMOVE_DESTINATION_SUCCESS, SERVICE_REMOVE_PORT_ERROR, SERVICE_REMOVE_PORT_REQUEST, SERVICE_REMOVE_PORT_SUCCESS, SERVICE_REMOVE_PROTOCOL_ERROR, SERVICE_REMOVE_PROTOCOL_REQUEST, SERVICE_REMOVE_PROTOCOL_SUCCESS, SERVICE_REMOVE_SOURCEPORT_ERROR, SERVICE_REMOVE_SOURCEPORT_REQUEST, SERVICE_REMOVE_SOURCEPORT_SUCCESS, SERVICE_SET_DESCRIPTION_ERROR, SERVICE_SET_DESCRIPTION_REQUEST, SERVICE_SET_DESCRIPTION_SUCCESS, SERVICE_SET_DESTINATION_ERROR, SERVICE_SET_DESTINATION_REQUEST, SERVICE_SET_DESTINATION_SUCCESS, SERVICE_SET_SHORT_ERROR, SERVICE_SET_SHORT_REQUEST, SERVICE_SET_SHORT_SUCCESS, SET_SELECTED_SERVICE } from "../../Actions/firewall/actiontypes";

const initialState = {
    servicesList: [],
    selectedService: '',
    description: '',
    short: '',
    ports: [],
    protocols: [],
    sourcePorts: [],
    destinations: [],
    isLoading: false,
    error: null,
};

const serviceReducer = (state=initialState, action) => {
    switch(action.type) {
        case SERVICE_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                servicesList: action.payload,
            };
        case SERVICE_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SET_SELECTED_SERVICE:
            return {
                ...state,
                selectedService: action.payload,
            };
        case SERVICE_GET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                description: action.payload,
            };
        case SERVICE_GET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_SET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_SET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_SET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_GET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                short: action.payload,
            };
        case SERVICE_GET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_SET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_SET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_SET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_GET_PORTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_PORTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ports: action.payload,
            };
        case SERVICE_GET_PORTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_ADD_PORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_ADD_PORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_ADD_PORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_REMOVE_PORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_REMOVE_PORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_REMOVE_PORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_GET_PROTOCOLS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_PROTOCOLS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                protocols: action.payload,
            };
        case SERVICE_GET_PROTOCOLS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_ADD_PROTOCOL_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_ADD_PROTOCOL_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_ADD_PROTOCOL_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_REMOVE_PROTOCOL_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_REMOVE_PROTOCOL_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_REMOVE_PROTOCOL_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_GET_SOURCEPORTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_SOURCEPORTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                sourcePorts: action.payload,
            };
        case SERVICE_GET_SOURCEPORTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_ADD_SOURCEPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_ADD_SOURCEPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_ADD_SOURCEPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_REMOVE_SOURCEPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_REMOVE_SOURCEPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_REMOVE_SOURCEPORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_GET_DESTINATIONS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_GET_DESTINATIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                destinations: action.payload,
            };
        case SERVICE_GET_DESTINATIONS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_SET_DESTINATION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_SET_DESTINATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_SET_DESTINATION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SERVICE_REMOVE_DESTINATION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SERVICE_REMOVE_DESTINATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case SERVICE_REMOVE_DESTINATION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case CREATE_SERVICE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case CREATE_SERVICE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case CREATE_SERVICE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case DELETE_SERVICE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case DELETE_SERVICE_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case DELETE_SERVICE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case FLUSH_SERVICE_DATA:
            return {
                ...initialState,
                servicesList: state.servicesList,
            };
        default:
            return state;
    }
}

export default serviceReducer;