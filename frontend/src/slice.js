import { createSlice } from "@reduxjs/toolkit";
const customerSlice = createSlice({
name: "customers", // slice name
initialState: [], // slice state
reducers: { // how to modify the state
addCustomer: (state, action) => { //add new customer
state.push(action.payload); // payload = { name, age }
},
},
});
// Export generated actions
export const { addCustomer } = customerSlice.actions;
// Export reducer to connect to store
export default customerSlice.reducer;