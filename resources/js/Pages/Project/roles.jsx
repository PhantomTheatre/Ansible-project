import React, { useState } from "react";
import {Link,  router, usePage} from '@inertiajs/react';

const Roles =(props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [local, setLocal] = useState(""); 
	const [tasks, setTasks] = useState(""); 
	const [right, setRight] = useState(""); 
	const [created_by, setCreated_by] = useState(""); 
	
	const saveData = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', tasks);
		setTasks(formData);
		router.post("/save/roles", {name, group, local, tasks,  right, created_by}, {forceFormData: true,});
	};
	
	return (
		<div>
			<h1>Roles page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.user == "none" ? 
			(<div>
				<h1>You must login to create roles</h1>
				<div><Link href="/user">
					Login
				</Link></div>
			</div>)
			: (
			<div>
				<h1>{auth.a}</h1>
				<form onSubmit={saveData}>
					<input
						onChange={(e)=>setTasks(e.target.files[0])} 
						type="file" name="tasks" id="tasks"/>
					<input 
						value={name} 
						onChange={(e)=>setName(e.target.value)} 
						type="name" name="name" id="name" placeholder="Name"/>
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
export default Roles;