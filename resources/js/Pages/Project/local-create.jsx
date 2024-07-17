import React, { useState } from "react";
import { Link, router, usePage} from '@inertiajs/react';

const Create = (props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [created_by, setCreated_by] = useState("");
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/local/create/save", {name, password, created_by});
	};
	
	return (
		<div>
			<h1>Local page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<form onSubmit={saveData}>
				<input 
					value={name} 
					onChange={(e)=>setName(e.target.value)} 
					type="name" name="name" id="name" placeholder="Name of local"/>
				<input 
					value={password} 
					onChange={(e)=>setPassword(e.target.value)} 
					type="password" name="password" id="password" placeholder="Password"/>
				<input 
					value={created_by} 
					onChange={(e)=>setCreated_by(e.target.value)} 
					type="created_by" name="created_by" id="created_by" placeholder="Created by"/>
				<button>Create Local</button>
			</form>
			<div><Link href="/local">
				Back
			</Link></div>
		</div>
	)
}

export default Create;