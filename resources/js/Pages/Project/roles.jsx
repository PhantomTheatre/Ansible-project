import React, { useState, useEffect, useRef } from "react";
import {Link,  router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';
import Editor from '@monaco-editor/react';

export default function Roles(props) {
	const { auth } = usePage().props;
	const actions = ["create", "edit", "code"];
	const [type, setType] = useState("create");
	const [selected_type, setSelected_type] = useState(type);
	
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [task, setTask] = useState(""); 
	const [global_, setGlobal] = useState(false); 
	const [typeFile, setTypeFile] = useState("file"); 
	const [code, setCode] = useState("// some comment");	
	const [id, setId] = useState(""); 
	const [group_on, setGroup_on] = useState(false); 
	
	
	const [role, setRole] = useState("");
	const [RolesFilter, setRolesFilter] = useState(Object.entries(props.roles));
	const [search_role, setSearch_role] = useState("");
	
	const GetRole = (el) =>{
		setRole(el);
		setName(el[1].name);
		setGroup(el[1].group);
		setGlobal(el[1].global);
		setCode(props.codes[el[1].id]);
		setId(el[1].id);
		setTypeFile("write");
		setTask(task);
	};
			
	const Reset = () => {
				setRole("");
				setName("");
				setGroup("");
				setGlobal(false);
				setGroup_on(false);
				setId("");
				setTypeFile("file");
				setTask("")
				setCode("// some comment" );
	};
	
	const [mouse, setMouse] = useState("up");
	const MouseMove = () => {
		if (mouse == "down" && event.pageY< window.innerHeight*(230/524)) {
			document.getElementById("lazer_child").style.top= 5+ 'px';
		}
		else if (mouse == "down" && event.pageY> window.innerHeight*(400/524)) {
			document.getElementById("lazer_child").style.top= window.innerHeight*(177/524)+ 'px';
		}
		else if (mouse == "down")  {
			document.getElementById("lazer_child").style.top= (event.pageY-(window.innerHeight*(225/524)))+ 'px';
			document.getElementById("lazer_child").ondragstart = () => {return false;};
		}
	}
	
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
			if (document.getElementById(selected_type).style.opacity == 0.5 && ((selected_type != "code" && type != "code") || (type == "edit" && selected_type == "code"  && role == "" ) || (type == "create" && selected_type == "code"  && role != "" ) )) { Reset(); }
			if (document.getElementById(selected_type).style.opacity <= 0) {
				clearInterval(self_object.change_flow);
				document.getElementById(selected_type).style.visibility = "collapse";
				setSelected_type(type);
			}
		}, 10);
	}
	const Delete = () => {
		router.post("/roles/delete", { role });
	};
		const saveData = () => {
		if (type == "create") {
			const formData = new FormData();
			formData.append('file', task);
			setTask(formData);
			router.post("/roles/save", {name, group, task, type, code, global_}, {forceFormData: true,});
		} else {
			router.post("/roles/edit", {name, group, task, type, code, global_, id}, {forceFormData: true,});
		}
	};
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
			console.log(document.getElementById(selected_type).style.transform);
		}
	}, [type]);
	useEffect(() => {
		if (task != "") {
			var reader = new FileReader();
			reader.readAsText(task);
			reader.onload = () => {setCode(reader.result)};
		}
	}, [task]);
	useEffect(() => {
		if (search_role == "") { setRolesFilter(Object.entries(props.roles))}
		else {
			let new_role_filter = [];
			Object.entries(props.roles).forEach((el) => {
				if (el[1]['name'].toLowerCase().includes(search_role.toLowerCase())) { new_role_filter.push(el)}
			});
			setRolesFilter(new_role_filter);
		}
	}, [search_role]);
	useEffect(() => {
		if (typeFile == "file" || (typeFile == "write" && type == "create")) {
			setCode("// some comment" );
			setTask("");
		} else if (typeFile == "write" && type == "edit") {
			props.roles.forEach((el) =>{
				if (id == el.id) {
					setCode(props.codes[el.id]);
					setTask(task);
				};
			}); 
		}
	}, [typeFile]);
	return (
		<Global.Provider value = {{user : props.user, local : props.local}}>
			<div>
				<Page_theme page={"Roles"} actions={actions} type = {type} setType={setType}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "45vh"}}>
							<div  style = {{margin:"2vh",}}>
								<h1>Log panel:</h1>
								<div  style = {{marginLeft:"0.5vw",}}>
									<p>You are registred: </p> <p><u>some time ago </u></p>
									<p>Count of lounched projects:</p> <p><u>some </u></p>
									<p>Count of selected hosts:</p> <p><u>some </u></p>
									<p>Count of selected roles:</p> <p><u>some </u></p>
									<p>Right on local:</p> <p><u>Admin </u></p>
								</div>
							</div>
						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
							
								<div style= {{marginLeft: "3vw", marginTop: "3vh", position: "absolute"}} >
										<div style= {{display: "flex", flexDirection: "inline"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Create new role</p>
												<input 
													className={"text_field"}
													value={name} 
													onChange={(e)=>setName(e.target.value)} 
													type="name" name="name" id="name" placeholder="Name"/>
											<p style= {{fontSize: "3vh", marginLeft: "1vw"}}>:</p>
										</div>
											<div style= {{marginLeft: "1vw", }}>
												<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"3vh"}}>Select type of task create:</p>
													<select className={"select"} value={typeFile} style={{marginTop: "3vh"}}  onChange={(e)=>setTypeFile(e.target.value)}>
														<option disabled>Type</option>
														<option value="file">File</option>
														<option value="write">Write</option>
													</select>
												</div>
												
													{typeFile== "file"? (
														<div style={{marginTop:"1vh", marginLeft: "2vw"}}>
															<input
																accept={".yml"}
																style={{ opacity: "0", width: "25vw", height:"4vh", position: "absolute", cursor: "pointer"}}
																onChange={(e)=>setTask(e.target.files[0])} 
																type="file" name="task" id="task"/>
															<div className={"select"} style={{marginTop: "2vh", background: "#e2e0de", height:"4vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
																{ task == "" ?
																<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Browse your file</p>
																: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Change</p>}
															</div>
															{ task == "" ?
															<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Load your file task here</p>
															: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Loaded file: {task.name}</p>}
														</div>
													) : (
														<div style={{border: "2px solid var(--colorShadowBrownGray)", margin: "2.48vh 0vh 2.5vh 1vh", background: "#8b8479", height:"5vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
															<p style= {{fontSize: "2vh"}}>Write your code in /code/ tab</p>
														</div>
													)}
														
												<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"1vh"}}>Group:</p>
													<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
														<input 
															disabled = {!group_on}
															style= {{marginLeft: "1.5vw", marginTop:"0.5vh",width: "15vw"}}
															className={"text_field"}
															value={group} 
															onChange={(e)=>setGroup(e.target.value)} 
															type="group" name="group" id="group" placeholder="Name of group"/>
														<Button_check setValue={setGroup_on} value={group_on} label={"Add role to some group"}/>
													</div>
												</div>
												<div style={{marginTop: "3vh"}}>
													<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this role"}/>
												</div>
												<div>
													<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"22vw"}} onClick={()=>{saveData()}}>Save role</button>
												</div>
											</div>
									</div>
							</div>
							
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									
									
									
									{role == "" &&
										
										<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%"}} >
											<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
												<p style= {{fontSize: "3vh"}}>Your hosts:</p>
												<div style={{display:"inline-flex", flexDirection: "row-reverse", width: "44vw", alignItems: "center"}}>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "18vw"}}
														value={search_role} 
														onChange={(e)=>setSearch_role(e.target.value)} 
														type="search_host" name="search_host" id="search_host" placeholder="Search"/>
													<p style= {{fontSize: "2.5vh", marginLeft: "1vw", marginTop:"0vh"}}>Seach:</p>
												</div>
											</div>
											<div style={{display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												<div  id = {"HostsMenu"} style={{width: "95%", height: "47vh",}}>	
													{RolesFilter.map((el) => (
														<div onClick={() => {GetRole(el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 7vw 11vw 11vw 8vw 5vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
															<div>{(RolesFilter.indexOf(el) +1) + "."}</div>
															<div>{el[1]['name']}</div>
															<div>Local: {el[1]['local']}</div>
															<div>Created by: {el[1]['created_by']}</div>
															<div>Group: {el[1]['group']}</div>
															<div>{el[1]['global']== "true" && <p>{'\u2713'}Global</p>}</div>
														</div>
														))}
													{RolesFilter.length == 0 &&
														<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
															There are no roles
														</div>
													}
														
												</div>
												{RolesFilter.length != 0 &&
													<div onMouseMove= {() => {MouseMove()}} onMouseLeave=  {() => {setMouse("up")}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "1.1vw", }}>
														<div style={{border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", height: "40vh", width: "40%",position: "relative", }} >
															<div 
																onMouseDown= {() => {setMouse("down")}}
																onMouseUp= {() => {setMouse("up")}}
																id={"lazer_child"}
																style={{position: "absolute", top:"0px", boxShadow: "-0.1vh 0.1vh 0.1vh 0vh var(--colorBrownGray)", border: "2px solid var(--colorShadowBrownGray)", background: "white",  width: "100%", height: "5vh", position: "relative"}}>
																
																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "30%"}}></div>
																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "50%"}}></div>
															</div>
														</div>
													</div>
												}
											</div>
										</div>
										}
										
										
									{role != "" &&
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >	
										<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit existing role  "{role[1]['name']}" :</p>
											<button className={"button_reset"} style= {{ marginLeft:"5vw"}} onClick= {()=>{Reset()}}>-> Back</button>
										</div>
										<div style={{width: "35vh", height: "35vw"}}>
											<div style= {{marginLeft: "2vw"}}>
													<div style= {{marginLeft: "1vw", }}>
												<div>
													<p style= {{fontSize: "2.5vh", marginTop:"0.5vh"}}>Name:</p>
													<input 
														style= {{fontSize: "2vh", marginLeft: "2vw"}}
														className={"text_field"}
														value={name} 
														onChange={(e)=>setName(e.target.value)} 
														type="name" name="name" id="name" placeholder="Name"/>
												</div>
												<div style= {{display: "flex", flexDirection: "inline", alignItems: "center", width: "45vw"}}>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"1.5vh"}}>Select type of task create:</p>
													<select className={"select"} value={typeFile} style={{marginTop: "1.5vh"}}  onChange={(e)=>setTypeFile(e.target.value)}>
														<option disabled>Type</option>
														<option value="file">File</option>
														<option value="write">Write</option>
													</select>
												</div>
												
													{typeFile== "file"? (
														<div style={{marginTop:"1vh", marginLeft: "2vw"}}>
															<input
																accept={".yml"}
																style={{ opacity: "0", width: "25vw", height:"4vh", position: "absolute", cursor: "pointer"}}
																onChange={(e)=>setTask(e.target.files[0])} 
																type="file" name="task" id="task"/>
															<div className={"select"} style={{marginTop: "0.5vh", background: "#e2e0de", height:"4vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
																{ task == "" ?
																<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Browse your file</p>
																: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Change</p>}
															</div>
															{ task == "" ?
															<p style= {{fontSize: "2vh", marginLeft: "1vw",  width: "25vw"}}>You can load other file to change exist</p>
															: <p style= {{fontSize: "2vh", marginLeft: "1vw", width: "25vw"}}>Loaded file: {task.name}</p>}
														</div>
													) : (
														<div style={{border: "2px solid var(--colorShadowBrownGray)", margin: "1.48vh 0vh 1.5vh 1vh", background: "#8b8479", height:"5vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
															<p style= {{fontSize: "2vh"}}>Edit your code in /code/ tab</p>
														</div>
													)}
														
												<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Group:</p>
													<div style= {{display: "flex", flexDirection: "inline", alignItems: "center", width: "45vw"}}>
														<input 
															disabled = {!group_on}
															style= {{marginLeft: "1.5vw", marginTop:"0.5vh",width: "15vw"}}
															className={"text_field"}
															value={group} 
															onChange={(e)=>setGroup(e.target.value)} 
															type="group" name="group" id="group" placeholder="Name of group"/>
														<Button_check setValue={setGroup_on} value={group_on} label={"Add role to some group"}/>
													</div>
												</div>
												<div style={{marginTop: "3vh", width: "25vw"}}>
													<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this role"}/>
												</div>
												<div style={{ width: "45vw"}}>
													<button className={"button_delete"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick= {()=>{Delete()}}>Delete</button>
													<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"6vw"}} onClick= {()=>{GetRole(role)}}>Reset</button>
													<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick={()=>{saveData()}}>Save role</button>
												</div>
											</div>

											</div>
											
											
										</div>
								</div>}
									
									
							</div>
							<div id = {actions[2]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-120vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
								<div style={{borderRadius: "5vh", padding: "3vh 2vw", width: "100%", height: "100%"}}>
									<div style={{border: "3px solid var(--colorShadowBrownGray)", boxShadow: "-0.9vh 0.4vh 0.5vh 0.1vh var(--colorBrownGray)", width: "100%", height: "100%"}}>
										<Editor 
											onChange={(value, event) => {setCode(value)}} 
											theme="vs-dark"
											height="100%" 
											width="100%"
											defaultLanguage="yaml" defaultValue="// some comment" 
											value={code}  />
									</div>
								</div>
							
							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}
