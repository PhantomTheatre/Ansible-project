import React, { useState } from "react";
import { Link, router, usePage} from '@inertiajs/react';

const Registration = (props) => {
	const { auth } = usePage().props;
	
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [right, setRight] = useState("");
	const [local, setLocal] = useState("");
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/user/registration/save", {login, password, email, right, local});
	};
	
	return (
		<div>
			<h1>User page</h1>
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
				<input 
					value={right} 
					onChange={(e)=>setRight(e.target.value)} 
					type="right" name="right" id="right" placeholder="Right"/>
				<input 
					value={local} 
					onChange={(e)=>setLocal(e.target.value)} 
					type="local" name="local" id="local" placeholder="Local"/>
				<button>Create User</button>
			</form>
			<div><Link href="/user">
				Back
			</Link></div>
		</div>
	)
}

export default Registration;