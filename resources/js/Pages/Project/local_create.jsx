import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Finder from './finder';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["new local", "your locals", "watch"];
	const [type, setType] = useState(actions[0]);
	const [selected_type, setSelected_type] = useState(type);
	
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [nameNew, setNameNew] = useState("");
	const [passwordNew, setPasswordNew] = useState("");
	
	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");
	
	const [local, setLocal] = useState("");
	const [local_type, setLocal_Type] = useState("menu");
	
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
	
	const Reset = () => {
		setErrors([]);
		setSelected_error("");
		setName("");
		setPassword("");
		setLocal("");
		setLocal_Type("menu");
	}
	
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
			console.log(document.getElementById(selected_type).style.transform);
		}
	}, [type]);
	useEffect(() => {
		console.log(props.hosts);
	}, []);
	
	const Enter = () => {
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(name)) {new_errors.push("name_error")}
		regex = /^(?=.*[a-z]{2,})(?=.*[0-9]{2,})(.{0,15})$/i  ;
		if (!regex.test(password)) {new_errors.push("password_error")}
		if (new_errors.length == 0) {
			router.post("/local/login", {name, password});
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	};
	const Create = () => {
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(nameNew)) {new_errors.push("nameNew_error")}
		regex = /^(?=.*[a-z]{2,})(?=.*[0-9]{2,})(.{0,15})$/i  ;
		if (!regex.test(passwordNew)) {new_errors.push("passwordNew_error")}
		if (new_errors.length == 0) {
				router.post("/local/create", {nameNew, passwordNew});
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	};
	
	const GetLocal = (el) => {
		setLocal(Object.values(el))
		console.log(Object.values(el))
	};

	const Back = () => {
		setLocal("")
	};
	
	
	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Locals"} actions={actions} type = {type} setType={setType}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "45vh"}}>
						
						
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
											) : type == actions[1] ? (
												<div>
													<u> It's place to edit yours host or  from local if your right it allows</u>
													<p> Select host you want to edit</p>
													<p> Write your data in input field</p>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											) : (
												<div>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											)}
										</div>
									) : (
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
											{(selected_error == "name_error" || selected_error == "nameNew_error" )&& 
											<div>
												<p> It's error in "name" input field:</p>
												<p> - must consist of 3-15 signs</p>
												<p> - Your data havn't contan some special sign </p>
												<p>except "-" and "_"</p>
												<p> - It must start and end with letter or number</p>
												<p> - It hadn't content 2 consecutive spaces</p>
											</div>
											}
											{(selected_error == "passwordNew_error" || selected_error == "password_error") && 
												<div>
													<p> It's error in "login" input field:</p>
													<p> Your written login contain invalid sign</p>
												</div>
											}
											{selected_error == "email_error" && 
												<div>
													<p> It's error in "email" input field:</p>
													<p> Your written email contain invalid sign</p>
												</div>
											}
										</div>
									)}
								</div>
							</div>
						
						
						
						
						
						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									<div style={{borderRadius: "10px", boxShadow: "-0.2vw 0.3vh 0.2px 0.2px var(--colorShadowBrownGray)", background: "var(--colorBrownGray)", border: "solid black 3px", position: "absolute", width: "0.8vw", height: "92%",  margin: "2vh 0vw 2vh 27.5vw", }}></div>
									<div style= {{width: "49.5vw", marginLeft: "2vw", justifyContent: "space-between", marginTop: "3vh", position: "absolute", display: "flex", flexDirection: "row"}} >
										<div style={{marginLeft: "1.5vw"}}>
											<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("authentication_error") ? ("visible") : ("collapse"), position: "absolute", width: "23vw", height: "4vh", background: "red"}}></div>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Enter to exist local:</p>
											<div style= {{marginLeft: "2vw"}}>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Name:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}}
															value={name} 
															onChange={(e)=>setName(e.target.value)} 
															type="name" name="name" id="name" placeholder="Name"/>
												</div>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("password_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Password:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}} 
															value={password} 
															onChange={(e)=>setPassword(e.target.value)} 
															type="password" name="password" id="password" placeholder="Password"/>
												</div>
												<div>
													<button className={"button_submit"} style= {{fontSize: "2vh", marginTop: "3vh", marginLeft:"12vw"}} onClick={()=>{Enter()}}>Enter</button>
												</div>
											</div>
										</div>
										
										<div style={{marginLeft: "2vw"}}>
											<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("authenticationNew_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
											<div style= {{fontSize: "3vh", display: "flex", marginRight: "-5vw", }}><p>Create new local:</p></div>
											<div style= {{marginLeft: "2vw"}}>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("nameNew_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Name:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}}
															value={nameNew} 
															onChange={(e)=>setNameNew(e.target.value)} 
															type="name" name="name" id="name" placeholder="Name"/>
												</div>
												<div>
														<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("passwordNew_error") ? ("visible") : ("collapse"), position: "absolute", width: "55%", height: "4vh", background: "red"}}></div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Password:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}} 
															value={passwordNew} 
															onChange={(e)=>setPasswordNew(e.target.value)} 
															type="password" name="password" id="password" placeholder="Password"/>
												</div>
												<div>
													<button className={"button_submit"} style= {{fontSize: "2vh", marginTop: "3vh", marginLeft:"12vw"}} onClick={()=>{Create()}}>Create</button>
												</div>
											</div>
										</div>
										
									</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
										
										{ local == "" ? (
											<Finder name_of_table={"Your locals"} 
												objects={props.locals} 
												cats={['name', 'right']} 
												grid_columns={'2vw 9vw 8vw 9vw 9vw 5vw'} 
												empty_label={"There are no hosts"}
												select_function={GetLocal}/>
										) : (
											<div>
												{ local_type == "members" ? (
													<p>{local[1]}</p>
												) : local_type == "edit" ? (
														<div style={{padding: "8vh 0vw 0vh 7.5vw", display: "flex", flexDirection: "column", width: "50vw", height: "50vh", alignItems: "center"}}>
														<div style={{fontSize: "4vh", display: "inline-flex"}}><p>Local: </p><u style={{paddingLeft: "0.6vw"}}>{local[0]}</u></div>
														<div style={{position: "absolute", background: "transparent", width: "23vw", height: "45vh", zIndex: "-1", marginTop: "-1vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}></div>
														<div>
																<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
																<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Name:</p>
																<div style={{display: "inline-flex"}}>
																	<input 
																		className={"text_field"}
																		style= {{marginLeft: "1.5vw", width: "14vw"}}
																		value={name} 
																		onChange={(e)=>setName(e.target.value)} 
																		type="name" name="name" id="name" placeholder="Name"/>
																	<button className={"button_reset"} style= {{width: "1vw", height: "3.5vh", margin: "0.5vh 0.5vw", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={()=>{Reset()}}  dangerouslySetInnerHTML={{ __html:  '<div> &#8635;</div>'}} ></button>
																</div>
														</div>
														<div> 
																<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("password_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
																<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Password:</p>
																<input 
																	className={"text_field"}
																	style= {{marginLeft: "1.5vw", width: "15vw"}} 
																	value={password} 
																	onChange={(e)=>setPassword(e.target.value)} 
																	type="password" name="password" id="password" placeholder="Password"/>
														</div>
														<div style ={{display: "inline-flex", justifyContent: "space-between", width: "18vw"}}>
															<button className={"button_delete"} style= {{width: "5vw", height: "4.5vh", marginTop: "7vh", marginLeft:"1vw"}} onClick= {()=>{Delete()}}>Delete</button>
															<button className={"button_submit"} style= {{width: "5vw", height: "4.5vh", marginTop: "7vh", marginLeft:"3vw"}} onClick={()=>{SaveData()}}>Save</button>
														</div>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "-39vh", marginRight: "44vw", width: "7vw"}} onClick={()=>{setLocal_Type("menu")}}>{"<- Back"}</button>
														
													</div>
												) : (
													<div style={{padding: "5vh 0vw 0vh 7.5vw", display: "flex", flexDirection: "column", width: "50vw", height: "50vh", alignItems: "center"}}>
														<b style={{fontSize: "5vh"}}>Edit menu</b>
														<div style={{fontSize: "4vh", display: "inline-flex"}}><p>Local: </p><u style={{paddingLeft: "0.6vw"}}>{local[0]}</u></div>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "3vh", width: "30vw"}} onClick={()=>{setLocal_Type("edit"); setName(local[0]); setPassword(local[1])}}>{"Edit Local ->"}</button>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "3vh", width: "35vw"}} onClick={()=>{setLocal_Type("members")}}>{"Edit Members ->"}</button>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "-27vh", marginRight: "44vw", width: "7vw"}} onClick={()=>{setLocal("")}}>{"<- Back"}</button>
													</div>
												)}
											</div>
										)}
										
										
										
							</div>
							<div id = {actions[2]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-120vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									<Finder name_of_table={"Popular locals"} 
											objects={props.locals} 
											cats={['name', 'right']} 
											grid_columns={'2vw 9vw 8vw 9vw 9vw 5vw'} 
											empty_label={"There are no hosts"}
											select_function={GetLocal}/>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}