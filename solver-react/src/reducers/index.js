// src/reducers/index.js
import cart from './cart';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    cart
});
export default rootReducer;
