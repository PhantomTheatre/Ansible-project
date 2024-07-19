import React, { useState } from "react";
import { Link, router, usePage } from '@inertiajs/react';

const Local = (props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/local/login", {name, password});
	};
	
	const [selected_user, setSelected_user] = useState("");
	const EditUser = (e) => {
		e.preventDefault();
		router.post("/local/rights/edit", {selected_user});
	};
	
	return (
		<div>
			<h1>Local page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<h1>Local admin: {props.admin}</h1>
			{props.local == "none" ? 
			(
				<div>
					<form onSubmit={saveData}>
						<input 
							value={name} 
							onChange={(e)=>setName(e.target.value)} 
							type="name" name="name" id="name" placeholder="Name of local"/>
						<input 
							value={password} 
							onChange={(e)=>setPassword(e.target.value)} 
							type="password" name="password" id="password" placeholder="Password"/>
						<button>Get in local</button>
					</form>
				</div>
			)
			: (
				<div>
					<form onSubmit={EditUser}>
						<select value={selected_user}  onChange={(e)=>setSelected_user(e.target.value)}>
								<option disabled>User</option>
								{props.workers.map((el) => (
								<option key={el.id} value={el.id}>{el.login}</option>))}
						</select>
						<button>Edit user</button>
					</form>
					<Link href="/local/exit">
						Exit
					</Link>
				</div>
			)
			}
			<div><Link href="/local/create">
				Create Local
			</Link></div>
			<div><Link href="/">
				Back
			</Link></div>
		</div>
	)
}

export default Local;