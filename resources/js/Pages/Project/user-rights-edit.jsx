import React, { useState } from "react";
import { Link, router, usePage } from '@inertiajs/react';

const UserRightsEdit = (props) => {
	const { auth } = usePage().props;
	
	const [right, setName] = useState(props.selected_user.right);
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/local/rights/edit/save", {right});
	};
	
	return (
		<div>
			<h1>Local page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<form onSubmit={saveData}>
				<input 
					value={right} 
					onChange={(e)=>setRight(e.target.value)} 
					type="right" name="right" id="right" placeholder="Right"/>
				<button>Create Local</button>
			</form>
			<div><Link href="/local">
				Back
			</Link></div>
		</div>
	)
}

export default UserRightsEdit;