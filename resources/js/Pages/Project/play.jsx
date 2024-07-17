import React, { useState } from "react";
import { router, usePage} from '@inertiajs/react';

const Hosts =(props) => {
	const { auth } = usePage().props;
	
	const [role, setRole] = useState(1);
	const [host, setHost] = useState(1);
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/play/launch", {role, host});
	};
	
	return (
		<div>
			<h1>Play page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<div>
				<form onSubmit={saveData}>
					<select value={host}  onChange={(e)=>setHost(e.target.value)}>
						<option disabled>Host</option>
						{props.hosts.map((el) => (
						<option key={el.id} value={el.id}>{el.name}</option>))}
					</select>
					<select value={role}  onChange={(e)=>setRole(e.target.value)}>
						<option disabled>Role</option>
						{props.roles.map((el) => (
						<option key={el.id} value={el.id}>{el.name}</option>))}
					</select>
					<button>Запустить</button>
				</form>
			</div>
		</div>
	)
}
export default Hosts;