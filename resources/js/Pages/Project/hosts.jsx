import React, { useState } from "react";
import { router, usePage} from '@inertiajs/react';
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
	const [local, setLocal] = useState("not listened"); 
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/save/hosts", { name, ip, login, password, group, local});
	};
	
	return (
		<div>
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
				<button>Добавить</button>
			</form>
			</div>
		</div>
	)
}
export default Hosts;