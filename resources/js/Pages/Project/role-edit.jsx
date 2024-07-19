import React, { useState } from "react";
import {Link,  router, usePage} from '@inertiajs/react';
import Editor from '@monaco-editor/react';



const EditRoles = (props) => {
	const { auth } = usePage().props;
	
	const [name, setName] = useState(props.role.name);
	const [group, setGroup] = useState(props.role.group);
	const [task, setTask] = useState(""); 
	const [right, setRight] = useState(props.role.right); 
	const [type, setType] = useState("file"); 
	const [code, setCode] = useState(props.code);	
	const id = props.role.id
	
	const saveData = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', task);
		setTask(formData);
		router.post("/roles/edit/save", {name, group,  task,  right, type, code, id}, {forceFormData: true,});
	};
	
	return (
		<div>
			<h1>Roles page</h1>
			<h1>Selected user: {props.user}</h1>
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
							id="editor"
							onChange={(value, event) => {setCode(value)}} 
							theme="vs-dark"
							height="40vh" 
							width="30vw"
						defaultLanguage="yaml" defaultValue={props.code} />
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
						value={right} 
						onChange={(e)=>setRight(e.target.value)} 
						type="right" name="right" id="right" placeholder="Right"/>
					<button>Edit role</button>
				</form>
			</div>
			<div><Link href="/roles">
				Back
			</Link></div>
		</div>
	)
}
export default EditRoles;