import { configureStore } from "@reduxjs/toolkit";
import zoneReducer from './Reducers/firewall/zone_reducer';
import policyReducer from './Reducers/firewall/policy_reducer';
import serviceReducer from './Reducers/firewall/service_reducer';
import ipsetReducer from './Reducers/firewall/ipset_reducer';

const store = configureStore({
    reducer: {
        zone: zoneReducer,
        policy: policyReducer,
        service: serviceReducer,
        ipset: ipsetReducer,
    }
});

export default store;