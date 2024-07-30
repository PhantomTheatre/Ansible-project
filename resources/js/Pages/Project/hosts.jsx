import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';

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
	const [group_on, setGroup_on] = useState(false); 
	const GetHost = (e) =>{
		setHost(e);
		props.hosts.forEach((el) =>{
			if (el.id == e) {
				setName(el.name);
				setIp(el.ip);
				setLogin(el.login);
				setPassword(el.password);
				setGroup(el.group);
				setGlobal(el.global);
				setId(el.id);
			};
			if (el.group != "none") {
				setGroup_on(true)
			}
		}); 
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
	
	const saveData = () => {
		if (host == "") {
			router.post("/hosts/save", { name, ip, login, password, group, global_});
		} else {
			router.post("/hosts/edit", { name, ip, login, password, group, id, global_});}
	};
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
		}
	}, [type]);
	useEffect(() => {
	}, [global_]);
	const Reset = () => {
		setName("");
		setIp("");
		setLogin("");
		setPassword("");
		setGroup("");
		setGlobal(false);
		setGroup_on(false);
		setHost("");
	};
	const Delete = () => {
		router.post("/hosts/delete", { host });
	};
	return (
		<Global.Provider value = {{user : props.user, local : props.local}}>
			<div>
				<Page_theme page={"Hosts"} actions={actions} type = {type} setType={setType}/>
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
							
							
							
								<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
									<div style= {{display: "flex", flexDirection: "inline"}}>
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Create new host</p>
											<input 
												className={"text_field"}
												value={name} 
												onChange={(e)=>setName(e.target.value)} 
												type="name" name="name" id="name" placeholder="Name"/>
										<p style= {{fontSize: "3vh", marginLeft: "1vw"}}>:</p>
									</div>
									<div style= {{marginLeft: "2vw"}}>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Ip addres:</p>
												<input 
													className={"text_field"}
													style= {{marginLeft: "1.5vw", width: "15vw"}}
													value={ip} 
													onChange={(e)=>setIp(e.target.value)} 
													type="ip" name="ip" id="ip" placeholder="Ip addres"/>
										</div>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0.5vh"}}>Сredentials:</p>
												<div style= {{display: "flex", flexDirection: "inline"}}>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={login} 
														onChange={(e)=>setLogin(e.target.value)} 
														type="login" name="login" id="login" placeholder="Login"/>
													<p style= {{fontSize: "2.5vh", margin: "0 1vw "}}>/</p>
													<input 
														className={"text_field"}
														style= {{ width: "15vw"}}
														value={password} 
														onChange={(e)=>setPassword(e.target.value)} 
														type="password" name="password" id="password" placeholder="Password"/>
												</div>
										</div>
										<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"3vh"}}>Group:</p>
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
										<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this host"}/>
									</div>
									<div>
										<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"22vw"}} onClick={()=>{saveData()}}>Save host</button>
									</div>
								</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
								<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
									<div style= {{display: "flex", flexDirection: "inline"}}>
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit existing host</p>
											<select value={host}  onChange={(e)=>GetHost(e.target.value)}>
												<option hidden>Host ...</option>
												<option disabled>Host ...</option>
												{props.hosts.map((el) => (
												<option key={el.id} value={el.id}>{el.name}</option>))}
											</select>
										<p style= {{fontSize: "3vh", marginLeft: "1vw"}}>:</p>
									</div>
									{host != "" &&
									<div>
										<div style= {{marginLeft: "2vw"}}>
											<div>
												<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Name:</p>
												<input 
													className={"text_field"}
													style= {{marginLeft: "1.5vw", width: "15vw"}}
													value={name} 
													onChange={(e)=>setIp(e.target.value)} 
													type="name" name="name" id="name" placeholder="Name"/>
											</div>
											<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Ip addres:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={ip} 
														onChange={(e)=>setIp(e.target.value)} 
														type="ip" name="ip" id="ip" placeholder="Ip addres"/>
											</div>
											<div>
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
															className={"text_field"}
															style= {{ width: "15vw"}}
															value={password} 
															onChange={(e)=>setPassword(e.target.value)} 
															type="password" name="password" id="password" placeholder="Password"/>
													</div>
											</div>
											<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Group:</p>
													<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
														<input 
															disabled = {!group_on}
															style= {{marginLeft: "1.5vw", width: "15vw"}}
															className={"text_field"}
															value={group} 
															onChange={(e)=>setGroup(e.target.value)} 
															type="group_edit" name="group_edit" id="group" placeholder="Name of group"/>
														<Button_check setValue={setGroup_on} value={group_on} label={"Add host to some group"}/>
													</div>
											</div>
											<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this host"} />
										</div>
										<div style={{display: "flex", flexDirection: "inline"}}>
											<button className={"button_delete"} style= {{marginTop: "3vh", marginLeft:"5vw"}} onClick= {()=>{Delete()}}>Delete</button>
											<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"9vw"}} onClick= {()=>{Reset()}}>Reset</button>
											<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick={()=>{saveData()}}>Save host</button>
										</div>
									</div>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}