import React, { useState } from "react";
import { Link, router, usePage } from '@inertiajs/react';

const Local = (props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	
	const [type, setType] = useState("none");
	
	const [user, setUser] = useState("");
	const [host, setHost] = useState("");
	const [role, setRole] = useState("");
	
	const [user_right, setUser_Right] = useState("");
	const [host_right, setHost_Right] = useState("");
	const [role_right, setRole_Right] = useState("");
	
	const Login = (e) => {
		e.preventDefault();
		router.post("/local/login", {name, password});
	};
	const EditLocal = (e) => {
		e.preventDefault();
		router.post("/local/edit/local", {name, password});
	};
	const EditUser= (e) => {
		e.preventDefault();
		router.post("/local/edit/user", {user_right, user});
	};
	const EditHost= (e) => {
		e.preventDefault();
		router.post("/local/edit/host", {host_right, host});
	};
	const EditRole= (e) => {
		e.preventDefault();
		router.post("/local/edit/role", {role_right, role});
	};
	const Exit = (e) => {
		e.preventDefault();
		router.post("/local/exit");
	};
	const Delete = (e) => {
		e.preventDefault();
		router.post("/local/delete");
	};
		const Create = (e) => {
		e.preventDefault();
		router.post("/local/create", {name, password});
	};
	
	const Reset = () => {
		setType("none");
		setName("");
		setPassword("");
		setUser("");
		setHost("");
		setRole("");
	};
	
	const EditLocalType = () => {
		setType("edit_local");
		setName(props.local.name);
		setPassword(props.local.password);
		
	};
	
	const GetUser = (e) =>{
		setUser(e);
		props.actors.forEach((el) =>{
			if (el.id == e) {
				setUser_Right(el.right);
			};
		}); 
	};
	const GetHost = (e) =>{
		setHost(e);
		props.hosts.forEach((el) =>{
			if (el.id == e) {
				setHost_Right(el.global);
			};
		}); 
	};
	const GetRole = (e) =>{
		setRole(e);
		props.roles.forEach((el) =>{
			if (el.id == e) {
				setRole_Right(el.global);
			};
		}); 
	};
	
	return (
		<div>
			<h1>Local page</h1>
			<h1>Selected user: {props.user}</h1>
			{(props.local_name != "none")  && (
				<div>
					<h1>Admin: {props.admin}</h1>
					<h1>Selected local:  {props.local_name}</h1>
					<h1>Your right:  {props.right}</h1>
				</div>
			)}
				{(type == "edit_local" || type == "create" || type == "login") && 
					<div>
						<input 
							value={name} 
							onChange={(e)=>setName(e.target.value)} 
							type="name" name="name" id="name" placeholder="Name"/>
						<input 
							value={password} 
							onChange={(e)=>setPassword(e.target.value)} 
							type="password" name="password" id="password" placeholder="Password"/>
						{(type == "edit_local") ? (
							<div><button onClick={EditLocal}>Edit</button></div>
						) : (type == "create") ? ( 
							<div><button onClick={Create}>Create</button></div>
						) : (
							<div><button onClick={Login}>Login</button></div>
						)}
					</div>
				}
				{(type == "edit_user") && 
					<div>
						<select value={user}  onChange={(e)=>GetUser(e.target.value)}>
							<option selected hidden>User ...</option>
							<option disabled>User ...</option>
							{props.actors.map((el) => (
							<option key={el.id} value={el.id}>{el.login}</option>))}
						</select>
						{(user != "") && 
							<div>
								<form onSubmit={EditUser}>
									<input 
										value={user_right} 
										onChange={(e)=>setUser_Right(e.target.value)} 
										type="user_right" name="user_right" id="user_right" placeholder="User right"/>
									<button>Edit</button>
								</form>
							</div>
						}
					</div>
				}
				{(type == "edit_host") && 
					<div>
						<select value={host}  onChange={(e)=>GetHost(e.target.value)}>
							<option selected hidden>Host ...</option>
							<option disabled>Host ...</option>
							{props.hosts.map((el) => (
							<option key={el.id} value={el.id}>{el.name}</option>))}
						</select>
						{(host != "") && 
						<div>
							<form onSubmit={EditHost}>
								<input 
									value={host_right} 
									onChange={(e)=>setHost_Right(e.target.value)} 
									type="host_right" name="host_right" id="host_right" placeholder="Global"/>
								<button>Edit</button>
							</form>
						</div>
						}
					</div>
				}
				{(type == "edit_role") && 
					<div>
						<select value={role}  onChange={(e)=>GetRole(e.target.value)}>
							<option selected hidden>Role ...</option>
							<option disabled>Role ...</option>
							{props.roles.map((el) => (
							<option key={el.id} value={el.id}>{el.name}</option>))}
						</select>
						{(role != "") && 
						<div>
							<form onSubmit={EditRole}>
								<input 
									value={role_right} 
									onChange={(e)=>setRole_Right(e.target.value)} 
									type="role_right" name="role_right" id="role_right" placeholder="Global"/>
								<button>Edit</button>
							</form>
						</div>
						}
					</div>
				}
				{((props.local_name == "none") && (type == "none")) ? (
					<div>
						<div><button onClick={() => {setType("login")}}>Enter to exist local</button></div>
						<div><button onClick={() => {setType("create")}}>Create Local</button></div>
						<div><Link href="/">Back</Link></div>
					</div>
				) : (type == "none") ? (
					<div>
						<div><button onClick={Exit}>Exit</button></div>
						{(props.right != "read") && 
							<div>
								{(props.right != "write") && 
									<div>
										<div><button onClick={EditLocalType}>Edit Local</button></div>
										<div><button onClick={() => { setType("edit_user")}}>Edit Users</button></div>
									</div>
								}
								<div><button onClick={() => { setType("edit_host")}}>Edit Hosts</button></div>
								<div><button onClick={() => { setType("edit_role")}}>Edit Roles</button></div>
							</div>
						}
						<div><Link href="/">Back</Link></div>
					</div>
				) : (
					<div><button onClick={Reset}>Back</button></div>
				)}
		</div>
	)
}

export default Local;