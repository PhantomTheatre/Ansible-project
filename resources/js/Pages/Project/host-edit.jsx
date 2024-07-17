import React, { useState } from "react";
import { Link, router, usePage} from '@inertiajs/react';

const HostEdit = (props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState(props.host.name);
	const [ip, setIp] = useState(props.host.ip);
	const [login, setLogin] = useState(props.host.login);
	const [password, setPassword] = useState(props.host.password);
	const [group, setGroup] = useState(props.host.group);
	const [right, setRight] = useState(props.host.right); 
	const id = props.host.id
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/hosts/edit/save", { name, ip, login, password, group, right, id});
	};
	
	return (
		<div>
			<h1>Hosts page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
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
						value={right} 
						onChange={(e)=>setRight(e.target.value)} 
						type="right" name="right" id="right" placeholder="Right"/>
				<button>Edit Host</button>
			</form>
			<div><Link href="/hosts">
				Back
			</Link></div>
		</div>
	)
}
export default HostEdit;