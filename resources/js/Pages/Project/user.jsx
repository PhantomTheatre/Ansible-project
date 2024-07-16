import React, { useState } from "react";
import { Link, router, usePage } from '@inertiajs/react';

const User = (props) => {
	const { auth } = usePage().props;
	
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/user/login", {login, password});
	};
	
	//{unreadMessages.length > 0 &&        <h2>          У вас {unreadMessages.length} непрочитанных сообщений.        </h2>      }
	//условие ? true : false.
	return (
		<div>
			<h1>User page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.user == "none" ? 
			(
				<form onSubmit={saveData}>
					<input 
						value={login} 
						onChange={(e)=>setLogin(e.target.value)} 
						type="login" name="login" id="login" placeholder="Login or email"/>
					<input 
						value={password} 
						onChange={(e)=>setPassword(e.target.value)} 
						type="password" name="password" id="password" placeholder="Password"/>
					<button>Login</button>
				</form>
			)
			: (
				<div><Link href="/user/exit">
				Exit
				</Link></div>
			)
			}
			<div><Link href="/user/registration">
				Registration
			</Link></div>
			<div><Link href="/">
				Back
			</Link></div>
		</div>
	)
}

export default User;