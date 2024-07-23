import React, { useState } from "react";
import { Link, router, usePage } from '@inertiajs/react';

const User = (props) => {
	const { auth } = usePage().props;
	
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	
	const [type, setType] = useState("none");
	
	const Login = (e) => {
		e.preventDefault();
		router.post("/user/login", {login, password});
	};
	const Edit = (e) => {
		e.preventDefault();
		router.post("/user/edit", {login, password, email});
	};
	const Exit = (e) => {
		e.preventDefault();
		router.post("/user/exit");
	};
	const Delete = (e) => {
		e.preventDefault();
		router.post("/user/delete");
	};
		const Registration = (e) => {
		e.preventDefault();
		router.post("/user/registration", {login, password, email});
	};
	
	const Reset = () => {
		setType("none");
		setLogin("");
		setPassword("");
		setEmail("");
	};
	
	const EditType = () => {
		setType("edit");
		setLogin(props.db_user.login);
		setPassword(props.db_user.password);
		setEmail(props.db_user.email);
	};

	
	return (
		<div>
			<h1>User page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
				{(type == "edit" || type == "registration" || props.user == "none") && 
					<div>
						<input 
							value={login} 
							onChange={(e)=>setLogin(e.target.value)} 
							type="login" name="login" id="login" placeholder="Login or email"/>
						<input 
							value={password} 
							onChange={(e)=>setPassword(e.target.value)} 
							type="password" name="password" id="password" placeholder="Password"/>
					</div>
				}
				{type == "edit"  ? (
						<div>
							<input 
								value={email} 
								onChange={(e)=>setEmail(e.target.value)} 
								type="email" name="email" id="email" placeholder="Email"/>
							<div><button onClick={Edit}>Save</button></div>
							<div><button onClick={Delete}>Delete</button></div>
							<div><button onClick={Reset}>Back</button></div>
						</div>
				) : (type == "registration") ? (
						<div>
							<input 
								value={email} 
								onChange={(e)=>setEmail(e.target.value)} 
								type="email" name="email" id="email" placeholder="Email"/>
							<div><button onClick={Registration}>Save</button></div>
							<div><button onClick={Reset}>Back</button></div>
						</div>
				) : (
					<div>
						{props.user == "none" ? (
							<div>
								<div><button onClick={Login}>Login</button></div>
								<div><button onClick={() => {setType("registration")}}>Registration</button></div>
								<div><Link href="/">Back</Link></div>
							</div>
						) : (
							<div>
								<div><button onClick={Exit}>Exit</button></div>
								<div><button onClick={EditType}>Edit</button></div>
								<div><Link href="/">Back</Link></div>
							</div>
						)}
					</div>
				)}
		</div>
	)
}

export default User;