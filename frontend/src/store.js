import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slice';
const store = configureStore({
reducer: {
customer: customerReducer
}
});
export default store;