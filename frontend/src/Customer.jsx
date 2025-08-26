import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCustomer } from "./slice";
import { useNavigate } from "react-router-dom";
function Customer() {
const [name, setName] = useState("");
const [age, setAge] = useState("");
const dispatch = useDispatch();
const navigate = useNavigate();
const handleAdd = () => {
if (name && age) {
dispatch(addCustomer({ name, age: Number(age) }));
setName("");
setAge("");
}
};
return (
<div>
<h2>Add Customer</h2>
<input
placeholder="Name"
value={name}

onChange={(e) => setName(e.target.value)}
/>{" "}
<input
placeholder="Age"
type="number"
value={age}
onChange={(e) => setAge(e.target.value)}
/>{" "}
<button onClick={handleAdd}>Add</button>
<br></br>
<button onClick={() => navigate("/details")}>
Go to Customer List
</button>
</div>
);
}
export default Customer;