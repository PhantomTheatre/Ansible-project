import React, { useState } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
					//<input 
					//value={local} 
					//onChange={(e)=>setIp(e.target.value)} 
					//type="local" name="local" id="local" placeholder="Local"/>

const Hosts =(props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [ip, setIp] = useState("");
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [group, setGroup] = useState("");
	const [local, setLocal] = useState(""); 
	const [right, setRight] = useState(""); 
	const [created_by, setCreated_by] = useState(""); 
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/save/hosts", { name, ip, login, password, group, local, right, created_by});
	};
	
	return (
		<div>
			<h1>Hosts page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.user == "none" ? 
			(<div>
				<h1>You must login to create hosts</h1>
				<div><Link href="/user">
					Login
				</Link></div>
			</div>)
			: (
			<div>
				<form onSubmit={saveData}>
					<input 
						value={name} 
						onChange={(e)=>setName(e.target.value)} 
						type="name" name="name" id="name" placeholder="Name"/>
					<input 
						value={ip} 
						onChange={(e)=>setIp(e.target.value)} 
						type="ip" name="ip" id="ip" placeholder="Ip addres"/>
					<input 
						value={login} 
						onChange={(e)=>setLogin(e.target.value)} 
						type="login" name="login" id="login" placeholder="Login"/>
					<input 
						value={password} 
						onChange={(e)=>setPassword(e.target.value)} 
						type="password" name="password" id="password" placeholder="Password"/>
					<input 
						value={group} 
						onChange={(e)=>setGroup(e.target.value)} 
						type="group" name="group" id="group" placeholder="Group"/>
					<input 
						value={local} 
						onChange={(e)=>setLocal(e.target.value)} 
						type="local" name="local" id="local" placeholder="Local"/>
					<input 
						value={right} 
						onChange={(e)=>setRight(e.target.value)} 
						type="right" name="right" id="right" placeholder="Right"/>
					<input 
						value={created_by} 
						onChange={(e)=>setCreated_by(e.target.value)} 
						type="created_by" name="created_by" id="created_by" placeholder="Created by"/>
					<button>Добавить</button>
				</form>
			</div>)
			}
			<div><Link href="/">
				Back
			</Link></div>
		</div>
	)
}
export default Hosts;