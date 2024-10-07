import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';
import Finder from './finder';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["create", "edit"];
	const [type, setType] = useState("create");
	const [selected_type, setSelected_type] = useState(type);
	
	const [name, setName] = useState("");
	const [ip, setIp] = useState("");
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [group, setGroup] = useState("");
	const [global_, setGlobal] = useState(false); 
	const [id, setId] = useState(""); 
	
	const [host, setHost] = useState("");
	const [Hosts, setHosts] = useState(Object.entries(props.hosts));
	const [group_on, setGroup_on] = useState(false); 
	
	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");
	
	const [shadows, setShadows] = useState(false);
	
	const GetHost = (el) =>{
		setHost(el);
		setName(el.name);
		setIp(el.ip);
		setLogin(el.login);
		setPassword(el.password);
		setGroup(el.group);
		setGlobal(Boolean(parseInt(el.global)));
		setId(el.id);
		if (el.group != "none") {
			setGroup_on(true)
		} else{setGroup_on(false)}
		setErrors("")
		setSelected_error("")
	};
	
	let self_object = useRef(null);
	self_object.rotation=5;
	
	
	
	const Change = () => {
		clearInterval(self_object.change_flow);
		document.getElementById(type).style.visibility = "visible";
		self_object.change_flow = setInterval(() => {
			document.getElementById(selected_type).style.opacity = document.getElementById(selected_type).style.opacity-0.05;
			document.getElementById(type).style.opacity = parseFloat(document.getElementById(type).style.opacity)+0.05;
			self_object.rotation = ((document.getElementById(type).style.opacity*20) * (85/20));
			document.getElementById(selected_type).style.transform = "rotateY("+ (0-self_object.rotation) + "deg)";
			document.getElementById(type).style.transform = "rotateY("+ (85-self_object.rotation) + "deg)";
			if (actions.indexOf(type)<actions.indexOf(selected_type)) {
				document.getElementById(type).style.transformOrigin = "left";
				document.getElementById(selected_type).style.transformOrigin = "right";
			} else {
				document.getElementById(type).style.transformOrigin = "right";
				document.getElementById(selected_type).style.transformOrigin = "left";
			}
			if (document.getElementById(selected_type).style.opacity == 0.5) { Reset(); }
			if (document.getElementById(selected_type).style.opacity <= 0) {
				clearInterval(self_object.change_flow);
				document.getElementById(selected_type).style.visibility = "collapse";
				setSelected_type(type);
			}
		}, 10);
	}
	
	useEffect(() => {
		if (type != selected_type) { Change(); }
	}, [type]);
	
	useEffect(() => {
		if (!group_on) { setGroup("none")}
		else if (type=="create") {setGroup("")}
		else if (type=="edit" && host['group'] != "none") {setGroup(host['group'])}
		else if (type=="edit" && host['group'] == "none") {setGroup("")}
	}, [group_on]);
	
	const Reset = () => {
		setName("");
		setIp("");
		setLogin("");
		setPassword("");
		setGroup("none");
		setGlobal(false);
		setGroup_on(false);
		setHost("");
		setErrors("");
		setSelected_error("");
	};
	
	
	const Delete = () => {
		router.post("/hosts/delete", { id });
		let new_name=name;
		Reset();
		setErrors(['success', 'success_delete', new_name]);
	};
	const SaveData = () => { 
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(name)) {new_errors.push("name_error")}
		if (group_on && !regex.test(group)) {new_errors.push("group_error")}
		regex = /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})$/  ;
		if (!regex.test(ip)) {new_errors.push("ip_error")}
		regex =/^(?!.*[\&\;\|\*\?\'\"\`\[\]\(\)\$\<\>\{\}\^\#\\\/\%\!])(.{1,})$/i  ;
		if (!regex.test(login)) {new_errors.push("login_error")}
		if (new_errors.length == 0) {
			if (type=="create") {
				router.post("/hosts/save", { name, ip, login, password, group, global_, group_on});
				let new_name=name;
				Reset();
				setErrors(['success', 'Success create', new_name]);
			} else {
				router.post("/hosts/edit", { name, ip, login, password, group, id, global_, group_on});
				let new_name=name;
				Reset();
				setErrors(['success', 'Success edit', new_name]);
			}
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	};
	
	useEffect(() => {
		setHosts(Object.entries(props.hosts));
	}, [props]);
	
	
	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Hosts"} actions={actions} type = {type} setType={setType}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "47vh"}}>
							
							
							
							
							<div  style = {{margin:"2vh", fontSize: "2vh"}}>
								<p style = {{display: "flex", justifyContent: "center", fontSize: "3vh"}}>Log panel:</p>
								<div  style = {{marginLeft:"0.5vw", marginTop: "0.5vh"}}>
									{errors.length == 0 ? (
										<div>
											{type == actions[0]  ? (
												<div>
													<u> It's place to add your new host</u>
													<p> Write your data in input field</p>
													<p> Check it all attentively </p>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											) : (
												<div>
													<u> It's place to edit yours host or  from local if your right it allows</u>
													<p> Select host you want to edit</p>
													<p> Write your data in input field</p>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											)}
										</div>
									) :  errors[0] != 'success' ? (
										<div>
											<u> Errors found ({errors.length})</u>
											<p>Select error to view info about</p>
											<div style={{display: "flex", justifyContent: "center", marginTop: "0.5vh", marginBottom: "0.5vh"}}>
												<select className={"select"} value={selected_error} onChange={(e)=>setSelected_error(e.target.value)}>
													<option value={""} disabled> {"Errors"} </option>
													{errors.map((el) => (
														<option key={el} value={el}> {el} </option>
													))}
												</select>
											</div>
											{selected_error == "name_error" && 
											<div>
												<p> It's error in "name" input field:</p>
												<p> - must consist of 3-15 signs</p>
												<p> - Your data havn't contan some special sign </p>
												<p>except "-" and "_"</p>
												<p> - It must start and end with letter or number</p>
												<p> - It hadn't content 2 consecutive spaces</p>
											</div>
											}
											{selected_error == "ip_error" && 
											<div>
												<p> It's error in "ip" input field:</p>
												<p> Your written ip don't meets the standard</p>
												<p> such us /192.0.2.1/</p>
											</div>
											}
											{selected_error == "login_error" && 
												<div>
													<p> It's error in "login" input field:</p>
													<p> Your written login contain invalid sign</p>
												</div>
											}
											{selected_error == "group_error" && 
											<div>
												<p> - must consist of 3-15 signs</p>
												<p> It's error in "group" input field:</p>
												<p> - Your data havn't contan some special sign </p>
												<p>except "-" and "_"</p>
												<p> - It must start and end with letter or number</p>
												<p> - It hadn't content 2 consecutive spaces</p>
											</div>
											}
										</div>
									) : ( 
										<div style={{height: "20vh", margin: "1.5vh 0 0 -0.5vw", background: "var(--colorInfo)", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
											<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
												<p className={"stroke"} style={{fontSize: "3.5vh", color: "green", }}>{errors[1]}</p>
												<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
												<div style={{position: "relative", display: "flex", flexDirection: "column-reverse", height: "8vh"}}>
													<button className={"button_submit"} style= {{ marginLeft:"8vw"}} onClick= {()=>{setErrors(""); setSelected_error("") }}>Well</button>
												</div>
											</div>
										</div>
									)}
								</div>
							
							
							
							</div>
						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
							
							
							
								<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
									<div style= {{display: "flex", flexDirection: "inline"}}>
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Create new host</p>
											<input 
												className={"text_field"}
												value={name} 
												onChange={(e)=>setName(e.target.value)} 
												type="name" name="name" id="name" placeholder="Name"/>
										<p style= {{fontSize: "3vh", marginLeft: "1vw"}}>:</p>
										<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "5vh", background: "red"}}></div>
									</div>
									<div style= {{marginLeft: "2vw"}}>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Ip addres:</p>
												<div style={{zIndex: "-1", opacity: "0.5", marginTop: "-3.5vh", marginLeft: "-0.5vw", visibility: errors.includes("ip_error") ? ("visible") : ("collapse"), position: "absolute", width: "49%", height: "3.5vh", background: "red"}}></div>
												<input 
													className={"text_field"}
													style= {{marginLeft: "1.5vw", width: "15vw"}}
													value={ip} 
													onChange={(e)=>setIp(e.target.value)} 
													type="ip" name="ip" id="ip" placeholder="Ip addres"/>
										</div>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0.5vh"}}>Сredentials:</p>
												<div style={{zIndex: "-1", opacity: "0.5", marginTop: "-3.5vh", marginLeft: "-0.5vw", visibility: errors.includes("login_error") ? ("visible") : ("collapse"), position: "absolute", width: "49%", height: "3.5vh", background: "red"}}></div>
												<div style= {{display: "flex", flexDirection: "inline"}}>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={login} 
														onChange={(e)=>setLogin(e.target.value)} 
														type="login" name="login" id="login" placeholder="Login"/>
													<p style= {{fontSize: "2.5vh", margin: "0 1vw "}}>/</p>
													<input 
														className={"text_field password"}
														style= {{ width: "15vw"}}
														value={password} 
														onChange={(e)=>setPassword(e.target.value)} 
														type="password" name="password" id="password" placeholder="Password"/>
												</div>
										</div>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"3vh"}}>Group:</p>
												<div style={{zIndex: "-1", opacity: "0.5", marginTop: "-3.5vh", marginLeft: "-0.5vw", visibility: errors.includes("group_error") ? ("visible") : ("collapse"), position: "absolute", width: "49%", height: "3.5vh", background: "red"}}></div>
												<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
													<input 
														disabled = {!group_on}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														className={"text_field"}
														value={group} 
														onChange={(e)=>setGroup(e.target.value)} 
														type="group" name="group" id="group" placeholder="Name of group"/>
													<Button_check setValue={setGroup_on} value={group_on} label={"Add host to some group"}/>
												</div>
										</div>
										<div style={{marginTop: "3vh"}}>
											<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this host"}/>
										</div>
									</div>
									<div>
										<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"22vw"}} onClick={()=>{SaveData()}}>Create host</button>
									</div>
								</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
										
								{host == "" &&	
									<Finder name_of_table={"Your hosts"} 
										objects={props.hosts} 
										cats={['name', 'ip', 'local', 'group', 'global']} 
										grid_columns={'2vw 9vw 8vw 9vw 9vw 5vw'} 
										empty_label={"There are no hosts"}
										select_function={GetHost}/>
								}
								{host != "" &&	
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >	
										<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit existing host  {host['name']} :</p>
											<button className={"button_reset"} style= {{ marginLeft:"5vw"}} onClick= {()=>{Reset()}}>-> Back</button>
										</div>
										<div style={{width: "35vh", height: "35vw"}}>
											<div style= {{marginLeft: "2vw"}}>
												<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Name:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={name} 
														onChange={(e)=>setName(e.target.value)} 
														type="name" name="name" id="name_edit" placeholder="Name"/>
												</div>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("ip_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Ip addres:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}}
															value={ip} 
															onChange={(e)=>setIp(e.target.value)} 
															type="ip" name="ip" id="ip_edit" placeholder="Ip addres"/>
												</div>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("login_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Сredentials:</p>
														<div style= {{display: "flex", flexDirection: "inline"}}>
															<input 
																className={"text_field"}
																style= {{marginLeft: "1.5vw", width: "15vw"}}
																value={login} 
																onChange={(e)=>setLogin(e.target.value)} 
																type="login" name="login" id="login" placeholder="Login"/>
															<p style= {{fontSize: "2.5vh", margin: "0 1vw "}}>/</p>
															<input 
																className={"text_field password"}
																style= {{ width: "15vw"}}
																value={password} 
																onChange={(e)=>setPassword(e.target.value)} 
																type="password" name="password" id="password_edit" placeholder="Password"/>
														</div>
												</div>
												<div style={{width: "50vw"}}>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("group_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Group:</p>
														<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
															<input 
																disabled = {!group_on}
																style= {{marginLeft: "1.5vw", width: "15vw"}}
																className={"text_field"}
																value={group} 
																onChange={(e)=>setGroup(e.target.value)} 
																type="group_edit" name="group_edit" id="group_edit" placeholder="Name of group"/>
															<Button_check setValue={setGroup_on} value={group_on} label={"Add host to some group"}/>
														</div>
												</div>
												<div style={{width: "20vw"}}>
													<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this host"} />
												</div>
											</div>
											<div style={{display: "flex", flexDirection: "inline", height: "8vh", width: "40vw"}}>
												<button className={"button_delete"} style= {{marginTop: "3vh", marginLeft:"5vw"}} onClick= {()=>{Delete()}}>Delete</button>
												<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"6vw"}} onClick= {()=>{GetHost(host)}}>Reset</button>
												<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"2vw"}} onClick={()=>{SaveData()}}>Save host</button>
											</div>
										</div>
									</div>
								}
								
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}