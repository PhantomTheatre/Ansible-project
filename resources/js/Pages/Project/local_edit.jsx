import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["Local", "Members"];
	const [type, setType] = useState(actions[0]);
	const [selected_type, setSelected_type] = useState(type);
	
	const [id, setId] = useState(props.local.id);
	const [name, setName] = useState(props.local.name);
	const [password, setPassword] = useState(props.local.password);
	
	const [Filter, setFilter]=  useState({"admin": true, "write": true,  "read": true,  "global": true,  "banned": false});
	
	const [actors, setActors]  = useState(Object.entries(props.actors));
	const [members, setMembers] = useState(Object.entries(props.actors));
	
	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");
	
	const ChangeValue = (key, value) => {
		actors.map((el) => {  
			if (el[0] == key) { 
				el[1] = value
			}  
		});
	}
	
	const ApplyFilter = () => {
		let new_members = [];
		actors.map((el) => {
			if (Filter[el[1]]) {new_members.push([...el]) }
		});
		console.log(new_members);
		setMembers(new_members);
		
	}
	
	
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
	
	const Reset = () => {
		console.log(props.actors);
		let new_actors = [];
		Object.entries(props.actors).forEach((el) => {
			new_actors.push([...el]);
			if (document.getElementById(el[0]) != null) {document.getElementById(el[0]).value=props.actors[el[0]]}
		});
		setActors(new_actors);
		
		let new_members = [];
		new_actors.map((el) => {
			if (Filter[el[1]]) {new_members.push([...el]) }
		});
		setMembers(new_members);
		
		setName(props.local.name);
		setPassword(props.local.password);
		
	}
	
	
	
	const Change = () => {
		clearInterval(self_object.change_flow);
		document.getElementById(type).style.visibility = "visible";
		self_object.change_flow = setInterval(() => {
			document.getElementById(selected_type).style.opacity = document.getElementById(selected_type).style.opacity-0.05;
			document.getElementById(type).style.opacity = parseFloat(document.getElementById(type).style.opacity)+0.05;
			self_object.rotation = self_object.rotation + (85/20);
			document.getElementById(selected_type).style.transform = "rotateY("+ (0-self_object.rotation) + "deg)";
			document.getElementById(type).style.transform = "rotateY("+ (85-self_object.rotation) + "deg)";
			if (actions.indexOf(type)<actions.indexOf(selected_type)) {
				document.getElementById(type).style.transformOrigin = "left";
				document.getElementById(selected_type).style.transformOrigin = "right";
			} else {
				document.getElementById(type).style.transformOrigin = "right";
				document.getElementById(selected_type).style.transformOrigin = "left";
			}
			if (document.getElementById(selected_type).style.opacity <= 0) {
				clearInterval(self_object.change_flow);
				document.getElementById(selected_type).style.visibility = "collapse";
				setSelected_type(type);
			}
		}, 10);
	}
	
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
			//console.log(document.getElementById(selected_type).style.transform);
			console.log( members);
		}
	}, [type]);
	useEffect(() => {
		//console.log(members);
	}, [Filter]);
	
	const SaveData = () => {
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(name)) {new_errors.push("name_error")}
		regex = /^(?=.*[a-z]{2,})(?=.*[0-9]{2,})(.{0,15})$/i  ;
		if (!regex.test(password)) {new_errors.push("password_error")}
		if (new_errors.length == 0) {
			router.post("/local/edit", {name, password, id});
			setErrors(['success', 'success_create']);
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	}
	
	const SaveMembers = () => {
		router.post("/local/members", {actors, id});
	}
	const Exit = () => {
		router.post("/local/exit");
	}
	const Delete = () => {
		router.post("/local/delete", {id});
	}
	
	useEffect(() => {
		if (Object.entries(props.errors).length > 0) {
			console.log(props);
		}
	}, [props]);
	
	
	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Local"} actions={actions} type = {type} setType={setType}/>
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
											) :  type == actions[1]  ? (
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
													<u> Console to write code</u>
													<p> /Microsoft's Monaco editor/</p>
													<p> Current mode:</p>
													<div style={{marginLeft: "1vw"}}>
														{(role == "" && task != "" && typeFile== "file")  ? (
															<div><p > Edit loaded file </p> <p style={{marginLeft: "1vw"}}> from /create/ tab</p></div>
														) : (role == "" && task == "" && typeFile== "write")  ? ( 
															<div><p > Write new role </p> <p style={{marginLeft: "1vw"}}> from /create/ tab</p></div>
														) : (role != "" && task != "" && typeFile== "file")  ? ( 
															<div><p > Edit loaded file </p> <p style={{marginLeft: "1vw"}}> from /edit/ tab</p></div>
														) : (role != "" && task == "" && typeFile== "write")  ? ( 
															<div><p > Edit your role </p> <p style={{marginLeft: "1vw"}}> from /edit/ tab</p></div>
														) : (
															<div><p>None</p></div>
														)}
													</div>
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
										</div>
									) : ( 
										<div>
										{errors[1] == 'success_create' ? (
											<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
												<p className={"stroke"} style={{fontSize: "3.5vh", color: "green", }}>Success create</p>
												<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
											</div>
										) : (
											<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
												<p className={"stroke"} style={{fontSize: "3vh", color: "green", }}>Success edit</p>
												<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
											</div>
										)}
										</div>
									)}
								</div>
							</div>
							
							
						
						
						
						</div>
						<div style = {{marginLeft: "3vw"}}>
							
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
										<div style={{display: "inline-grid", gridTemplateColumns: "15vw 20vw", alignItems: "center"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit your local:</p>
											<button className={"button_reset"} style= {{width: "7vw", fontSize: "2.2vh", padding: "0.5vh 0.5vw",  marginTop: "2vh", marginLeft:"4vw"}} onClick={()=>{Reset()}}  dangerouslySetInnerHTML={{ __html:  '<div>Reset &#8635;</div>'}} ></button>
										</div>
										<div style= {{marginLeft: "2vw"}}>
											<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Name:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={name} 
														onChange={(e)=>setName(e.target.value)} 
														type="name" name="name" id="name" placeholder="Name"/>
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
											<div style={{fontSize: "2.3vh"}}>
												<button className={"button_delete"} style= {{marginTop: "6vh", marginLeft:"1vw"}} onClick= {()=>{Delete()}}>Delete</button>
												<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"4vw"}} onClick={()=>{Exit()}}>Exit</button>
												<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick={()=>{SaveData()}}>Save</button>
											</div>
										</div>
									</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%"}} >
										<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
											<p style= {{fontSize: "3vh"}}>Members of this local:</p>
											<div style={{display:"inline-flex", flexDirection: "row-reverse", width: "36vw", alignItems: "center"}}>
												<button className={"button_submit"} onClick={()=>{SaveMembers()}}>Save all</button>
												<button className={"button_reset"} style={{marginRight: "2vw"}}onClick={()=>{Reset()}}>Reset</button>
											</div>
										</div>
										<div style={{display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
											<div  style={{width: "95%", height: "47vh",}}>
													{members.map((el) => (
													<div style={{display: "grid", gridTemplateColumns: '2vw 28vw 5vw 3vw', border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", fontSize: "2.5vh", alignItems: "center"}} key={el} value={el}>
														<div>
															{(members.indexOf(el) +1) + "."}
														</div>
														<div>
															{el[0]}
														</div>
														<div>
															Right:
														</div>
														<div>
															<select id= {el[0]} defaultValue={el[1]} className={"select"} onChange={(e) => {ChangeValue(el[0], e.target.value); ApplyFilter()}}>
																<option hidden>Right</option>
																<option value={"admin"}>Admin</option>
																<option value={"write"}>Writer</option>
																<option value={"read"}>Reader</option>
																<option value={"global"}>Global</option>
																<option value={"banned"}>Banned</option>
															</select>
														</div>
													</div>))
													}
													{members.length == 0 &&
														<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
															There are no members available with the selected filter
														</div>
													}
													
											</div>
											{members.length != 0 &&
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
									<div style={{display:"inline-flex",  flexDirection: "row-reverse",  width: "105%", padding: "0.8vh 4vw 0vh 0vw", alignItems: "center", fontSize: "2vh",}}>
										<button className={"button_reset"} onClick={()=>{ApplyFilter()}}>Apply filter</button>
										<div style={{ marginTop:"0.5vh", display:"inline-flex",}}>
											<Button_check setValue={(e) => {Filter["admin"]=e}} value={Filter["admin"]} label={"Admin"}/>
											<Button_check setValue={(e) => {Filter["write"]=e}} value={Filter["write"]} label={"Writer"}/>
											<Button_check setValue={(e) => {Filter["read"]=e}} value={Filter["read"]} label={"Reader"}/>
											<Button_check setValue={(e) => {Filter["global"]=e}} value={Filter["global"]} label={"Global"}/>
											<Button_check setValue={(e) => {Filter["banned"]=e}} value={Filter["banned"]} label={"Banned"}/>
										</div>
										Filter:
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