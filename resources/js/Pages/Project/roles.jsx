import React, { useState } from "react";
import {Link,  router, usePage} from '@inertiajs/react';
import Editor from '@monaco-editor/react';



const Roles =(props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [local, setLocal] = useState(""); 
	const [task, setTask] = useState(""); 
	const [right, setRight] = useState(""); 
	const [created_by, setCreated_by] = useState("");
	const [type, setType] = useState("file"); 
	const [code, setCode] = useState("// some comment");	
	const [id, setId] = useState(""); 
	
	const saveData = (e) => {
		e.preventDefault();
		if (role == "") {
			const formData = new FormData();
			formData.append('file', task);
			setTask(formData);
			router.post("/roles/save", {name, group, local, task,  right, created_by, type, code}, {forceFormData: true,});
		} else {
			router.post("/roles/edit", {name, group, local, task,  right, created_by, type, code, id}, {forceFormData: true,});
		}
	};
	
	const [role, setRole] = useState(""); 
	const GetRole = (e) =>{
		setRole(e);
		props.roles.forEach((el) =>{
			if (el.id == e) {
				setName(el.name);
				setGroup(el.group);
				setLocal(el.local);
				setRight(el.right);
				setCreated_by(el.created_by);
				setCode(props.codes[el.id]);
				setId(el.id);
				const formData = new FormData();
				formData.append('file', task);
				setTask(formData);
			};
		}); 
	};
			
	const Reset = () => {
				setRole("");
				setName("");
				setGroup("");
				setLocal("");
				setRight("");
				setCreated_by("");
				setId("");
				setCode("// some comment" );
	};
	
		const Delete = () => {
		router.post("/roles/delete", { role });
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
							onChange={(e)=>setTask(e.target.files[0])} 
							type="file" name="task" id="task"/>)
					: (
						<Editor 
							onChange={(value, event) => {setCode(value)}} 
							theme="vs-dark"
							height="40vh" 
							width="30vw"
							defaultLanguage="yaml" defaultValue="// some comment" 
							value={code}  />
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
					{(role == "") ?
						(<button>Добавить</button>)
					: (<button>Обновить</button>)}
				</form>
				<div>
					<select value={role}  onChange={(e)=>GetRole(e.target.value)}>
						<option selected hidden>Role ...</option>
						<option disabled>Role ...</option>
						{props.roles.map((el) => (
						<option key={el.id} value={el.id}>{el.name}</option>))}
					</select>
					{(role != "") ?
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
export default Roles;