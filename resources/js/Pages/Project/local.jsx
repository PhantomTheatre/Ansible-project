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
	
	//{unreadMessages.length > 0 &&        <h2>          У вас {unreadMessages.length} непрочитанных сообщений.        </h2>      }
	//условие ? true : false.
	return (
		<div>
			<h1>Local page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			{props.local == "none" ? 
			(
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
			)
			: (
				<div><Link href="/local/exit">
				Exit
				</Link></div>
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