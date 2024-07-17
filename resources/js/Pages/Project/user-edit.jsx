import React, { useState } from "react";
import { Link, router, usePage} from '@inertiajs/react';

const UserEdit = (props) => {
	const { auth } = usePage().props;
	
	const [login, setLogin] = useState(props.db.login);
	const [password, setPassword] = useState(props.db.password);
	const [email, setEmail] = useState(props.db.email);
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/user/edit/save", {login, password, email});
	};
	
	return (
		<div>
			<h1>User page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<form onSubmit={saveData}>
				<input 
					value={login} 
					onChange={(e)=>setLogin(e.target.value)} 
					type="login" name="login" id="login" placeholder="Login or email"/>
				<input 
					value={password} 
					onChange={(e)=>setPassword(e.target.value)} 
					type="password" name="password" id="password" placeholder="Password"/>
				<input 
					value={email} 
					onChange={(e)=>setEmail(e.target.value)} 
					type="email" name="email" id="email" placeholder="Email"/>
				<button>Create User</button>
			</form>
			<div><Link href="/user">
				Back
			</Link></div>
		</div>
	)
}
export default UserEdit;