import React, { useState } from "react";
import {Link,  router, usePage} from '@inertiajs/react';
import Editor from '@monaco-editor/react';



const Roles =(props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [local, setLocal] = useState(""); 
	const [tasks, setTasks] = useState(""); 
	const [right, setRight] = useState(""); 
	const [created_by, setCreated_by] = useState("");
	const [type, setType] = useState("file"); 
	const [code, setCode] = useState("// some comment");	
	
	const saveData = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', tasks);
		setTasks(formData);
		router.post("/save/roles", {name, group, local, tasks,  right, created_by, type, code}, {forceFormData: true,});
	};
	
	const [role, setRole] = useState(""); 
	const EditRole = (e) => {
		e.preventDefault();
		router.post("/roles/edit", { role});
	};
	
	
	
	return (
		<div>
			<h1>Roles page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
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
				<select value={type}  onChange={(e)=>setType(e.target.value)}>
					<option disabled>Type</option>
					<option value="file">File</option>
					<option value="write">Write</option>
				</select>
				<form onSubmit={saveData}>
					{type == "file" ?
						(<input
							onChange={(e)=>setTasks(e.target.files[0])} 
							type="file" name="tasks" id="tasks"/>)
					: (
						<Editor 
							onChange={(value, event) => {setCode(value)}} 
							theme="vs-dark"
							height="40vh" 
							width="30vw"
							defaultLanguage="yaml" defaultValue="// some comment" />
					)}
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
				<div>
					<form onSubmit={EditRole}>
					<select value={role}  onChange={(e)=>setRole(e.target.value)}>
						<option disabled>Role</option>
						{props.roles.map((el) => (
						<option key={el.id} value={el.id}>{el.name}</option>))}
					</select>
					</form>
					<Link href="/roles/edit">
						 Edit
					</Link>
				</div>
			</div>)
			}
			<div><Link href="/">
				Back
			</Link></div>
		</div>
	)
}
export default Roles;