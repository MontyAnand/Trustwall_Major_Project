import { POLICY_LIST_ERROR, POLICY_LIST_REQUEST, POLICY_LIST_SUCCESS } from "../../Actions/firewall/actiontypes";

const initialState = {
    policiesList: [],
    isLoading: false,
    error: null,
};

const policyReducer = (state=initialState, action) => {
    switch(action.type) {
        case POLICY_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case POLICY_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                policiesList: action.payload,
            };
        case POLICY_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default policyReducer;