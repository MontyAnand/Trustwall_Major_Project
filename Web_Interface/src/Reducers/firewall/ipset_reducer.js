import { CREATE_IPSET_ERROR, CREATE_IPSET_REQUEST, CREATE_IPSET_SUCCESS, DELETE_IPSET_ERROR, DELETE_IPSET_REQUEST, DELETE_IPSET_SUCCESS, FLUSH_IPSET_DATA, IPSET_ADD_ENTRY_ERROR, IPSET_ADD_ENTRY_REQUEST, IPSET_ADD_ENTRY_SUCCESS, IPSET_GET_DESCRIPTION_ERROR, IPSET_GET_DESCRIPTION_REQUEST, IPSET_GET_DESCRIPTION_SUCCESS, IPSET_GET_ENTRIES_ERROR, IPSET_GET_ENTRIES_REQUEST, IPSET_GET_ENTRIES_SUCCESS, IPSET_GET_SHORT_ERROR, IPSET_GET_SHORT_REQUEST, IPSET_GET_SHORT_SUCCESS, IPSET_LIST_ERROR, IPSET_LIST_REQUEST, IPSET_LIST_SUCCESS, IPSET_REMOVE_ENTRY_ERROR, IPSET_REMOVE_ENTRY_REQUEST, IPSET_REMOVE_ENTRY_SUCCESS, IPSET_SET_DESCRIPTION_ERROR, IPSET_SET_DESCRIPTION_REQUEST, IPSET_SET_DESCRIPTION_SUCCESS, IPSET_SET_SHORT_ERROR, IPSET_SET_SHORT_REQUEST, IPSET_SET_SHORT_SUCCESS, IPSET_TYPES_LIST_ERROR, IPSET_TYPES_LIST_REQUEST, IPSET_TYPES_LIST_SUCCESS, SET_SELECTED_IPSET } from "../../Actions/firewall/actiontypes";

const initialState = {
    ipsetsList: [],
    ipsetTypesList: [],
    selectedIPSet: '',
    description: '',
    short: '',
    entries: [],
    isloading: false,
    error: null,
};

const ipsetReducer = (state=initialState, action) => {
    switch(action.type) {
        case IPSET_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ipsetsList: action.payload,
            };
        case IPSET_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_TYPES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_TYPES_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ipsetTypesList: action.payload,
            };
        case IPSET_TYPES_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SET_SELECTED_IPSET:
            return {
                ...state,
                selectedIPSet: action.payload,
            };
        case IPSET_GET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_GET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                description: action.payload,
            };
        case IPSET_GET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_SET_DESCRIPTION_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_SET_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case IPSET_SET_DESCRIPTION_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_GET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_GET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                short: action.payload,
            };
        case IPSET_GET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_SET_SHORT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_SET_SHORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case IPSET_SET_SHORT_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_GET_ENTRIES_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_GET_ENTRIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                entries: action.payload,
            };
        case IPSET_GET_ENTRIES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_ADD_ENTRY_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_ADD_ENTRY_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case IPSET_ADD_ENTRY_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case IPSET_REMOVE_ENTRY_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case IPSET_REMOVE_ENTRY_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case IPSET_REMOVE_ENTRY_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case CREATE_IPSET_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case CREATE_IPSET_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case CREATE_IPSET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case DELETE_IPSET_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case DELETE_IPSET_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case DELETE_IPSET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case FLUSH_IPSET_DATA:
            return {
                ...initialState,
                ipsetsList: state.ipsetsList,
                ipsetTypesList: state.ipsetTypesList,
            }
        default:
            return state;
    }
}

export default ipsetReducer;