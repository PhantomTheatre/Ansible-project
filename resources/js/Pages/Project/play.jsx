import React, { useEffect, useState } from "react";
import {Link,  router, usePage} from '@inertiajs/react';

const Hosts =(props) => {
	const { auth } = usePage().props;
	
	const [role, setRole] = useState("");
	const [host, setHost] = useState("");
	const [selected_hosts, setSelected_hosts] = useState(props.hosts);
	const [selected_roles,  setSelected_roles] = useState(props.roles);
	const [type_1, setType_1] = useState(true);
	const [type_2, setType_2] = useState(true);
	const [type_3, setType_3] = useState(false);
	
	const [typeHost, setTypeHost] = useState("single");
	const [typeRole, setTypeRole] = useState("single");
	const [groups_hosts, setGroups_hosts] = useState();
	const [groups_roles, setGroups_roles] = useState();
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/play/launch", {role, host, typeHost, typeRole});
	};
	useEffect(() => {
		let hosts = [];
		let roles = [];
		{props.hosts.map((el) => {
			if (type_1 == true && el.local == "none") {
				if (type_3 == true ) {
					if  (el.created_by == props.user) { hosts.push(el); }
				} else { hosts.push(el);}
			}
			if (type_2 == true && el.local != "none") {
				if (type_3 == true ) {
					if  (el.created_by == props.user) { hosts.push(el); }
				} else { hosts.push(el);}
			}
		})}
		{props.roles.map((el) => {
			if (type_1 == true && el.local == "none") {
				if (type_3 == true ) {
					if  (el.created_by == props.user) { roles.push(el); }
				} else { roles.push(el);}
			}
			if (type_2 == true && el.local != "none") {
				if (type_3 == true ) {
					if  (el.created_by == props.user) { roles.push(el); }
				} else { roles.push(el);}
			}
		})}
		
		setSelected_hosts(hosts);
		setSelected_roles(roles);
		setRole("Role ...");
		setHost("Host ...");
	}, [type_1, type_2, type_3]);
	
	useEffect(() => {
		let host_gr = [];
		let role_gr = [];
		{selected_hosts.map((el) => {
			if (host_gr.includes(el.group) == false) {
				host_gr.push(el.group);
			}
		})}
		{selected_roles.map((el) => {
			if (role_gr.includes(el.group) == false) {
				role_gr.push(el.group);
			}
		})}
		setGroups_hosts(host_gr);
		setGroups_roles(role_gr);
	}, [selected_hosts, selected_roles]);
	
	return (
		<div>
			<h1>Play page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<div>
			<h1> Режим выбора</h1>
				{(props.local != "none")  && (
					<div>
						<input defaultChecked={true} type="checkbox" id="type_1" name="type_1" onClick={(e)=>(setType_1(! type_1))} />
						<label>Пользовательская среда</label>
						<input defaultChecked={true} type="checkbox" id="type_2" name="type_2" onClick={(e)=>(setType_2(! type_2))} />
						<label>Локальная среда</label>
						<input defaultChecked={false} type="checkbox" id="type_3" name="type_3" onClick={(e)=>(setType_3(! type_3))} />
						<label>Только текущий пользователь</label>
					</div>
				)}
					<select value={typeHost}  onChange={(e)=>{setHost("Host ..."); setTypeHost(e.target.value);}}>
						<option value={"single"}>Single(Host)</option>
						<option value={"group"}>Group(Host)</option>
					</select>
					<select value={typeRole}  onChange={(e)=>{setRole("Role ..."); setTypeRole(e.target.value);}}>
						<option value={"single"}>Single(Role)</option>
						<option value={"group"}>Group(Role)</option>
					</select>
			</div>
			
			<h1> Меню запуска проекта</h1>
			{(selected_hosts != "" && selected_roles != "") ? (
				<div>
					<form onSubmit={saveData}>
						{typeHost == "single" ? (
							<select value={host}  onChange={(e)=>setHost(e.target.value)}>
								<option disabled>Host ...</option>
								{selected_hosts.map((el) => (
								<option key={el.id} value={el.id}>{el.name}</option>))}
							</select>
						) : (
							<select value={host}  onChange={(e)=>setHost(e.target.value)}>
								<option disabled>Host ...</option>
								{groups_hosts.map((el) => (
								<option key={el} value={el}>{el}</option>))}
							</select>
						)}
						{typeRole == "single" ? (
							<select value={role}  onChange={(e)=>setRole(e.target.value)}>
								<option disabled>Role ...</option>
								{selected_roles.map((el) => (
								<option key={el.id} value={el.id}>{el.name}</option>))}
							</select>
						) : (
							<select value={role}  onChange={(e)=>setRole(e.target.value)}>
								<option disabled>Role ...</option>
								{groups_roles.map((el) => (
								<option key={el} value={el}>{el}</option>))}
							</select>
						)}
						<button>Запустить</button>
					</form>
				</div>
			) : (
				<div>
					{(selected_hosts == "" ) &&
					<h1>Нет доступных хостов</h1>}
					{(selected_roles == "" ) &&
					<h1>Нет доступных ролей</h1>}
				</div>
			)}
			<div><Link href="/">Back</Link></div>
		</div>
	)
}
export default Hosts;