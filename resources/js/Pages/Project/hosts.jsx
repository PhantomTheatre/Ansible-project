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
	const [id, setId] = useState(""); 
	
	const saveData = (e) => {
		e.preventDefault();
		if (host == "") {
			router.post("/hosts/save", { name, ip, login, password, group, local, right, created_by});
		} else {
			router.post("/hosts/edit", { name, ip, login, password, group, local, right, created_by, id});}
	};
	const [host, setHost] = useState(""); 
	const GetHost = (e) =>{
		setHost(e);
		props.hosts.forEach((el) =>{
			if (el.id == e) {
				setName(el.name);
				setIp(el.ip);
				setLogin(el.login);
				setPassword(el.password);
				setGroup(el.group);
				setLocal(el.local);
				setRight(el.right);
				setCreated_by(el.created_by);
				setId(el.id);
			};
		}); 
	};
			
	const Reset = () => {
		setName("");
		setIp("");
		setLogin("");
		setPassword("");
		setGroup("");
		setLocal("");
		setRight("");
		setCreated_by("");
		setHost("");
	};
	const Delete = () => {
		router.post("/hosts/delete", { host });
	};
	
	return (
		<div>
			<h1>Hosts page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
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
						{(host == "") ?
						(<button>Добавить</button>)
						: (<button>Изменить</button>) }
				</form>
				<div>
					<select value={host}  onChange={(e)=>GetHost(e.target.value)}>
						<option selected hidden>Host ...</option>
						<option disabled>Host ...</option>
						{props.hosts.map((el) => (
						<option key={el.id} value={el.id}>{el.name}</option>))}
					</select>
					{(host != "") ?
						(
						<div>
							<button onClick={Reset}>Reset</button>
							<div><button onClick={Delete}>Delete</button></div>
						</div>
						) :  (
						<div>
							<Link href="/">
								Back
							</Link>
						</div>
					)}
				</div>
			</div>)
			}
		</div>
	)
}
export default Hosts;