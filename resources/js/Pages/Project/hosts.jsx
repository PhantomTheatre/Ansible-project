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
	const [HostsFilter, setHostsFilter] = useState(Object.entries(props.hosts));
	const [search_host, setSearch_host] = useState("");
	const [group_on, setGroup_on] = useState(false); 
	
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
	
	
	const GetHost = (el) =>{
		setHost(el);
		setName(el[1].name);
		setIp(el[1].ip);
		setLogin(el[1].login);
		setPassword(el[1].password);
		setGroup(el[1].group);
		setGlobal(Boolean(el[1].global));
		setId(el[1].id);
		if (el[1].group != "none") {
			setGroup_on(true)
		}
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
			router.post("/hosts/save", { name, ip, login, password, group, global_, group_on});
		} else {
			router.post("/hosts/edit", { name, ip, login, password, group, id, global_, group_on});}
	};
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
		}
	}, [type]);
	useEffect(() => {
		console.log(HostsFilter);
	}, []);
	
	useEffect(() => {
		if (search_host == "") { setHostsFilter(Object.entries(props.hosts))}
		else {
			let new_host_filter = [];
			Object.entries(props.hosts).forEach((el) => {
				if (el[1]['name'].toLowerCase().includes(search_host.toLowerCase())) { new_host_filter.push(el)}
			});
			setHostsFilter(new_host_filter);
		}
	}, [search_host]);
	
	
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
										<div style={{marginTop: "3vh"}}>
											<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this host"}/>
										</div>
									</div>
									<div>
										<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"22vw"}} onClick={()=>{saveData()}}>Create host</button>
									</div>
								</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
										
										
										{host == "" &&
										
										<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%", }} >
											<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
												<p style= {{fontSize: "3vh"}}>Your hosts:</p>
												<div style={{display:"inline-flex", flexDirection: "row-reverse", width: "44vw", alignItems: "center"}}>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "18vw"}}
														value={search_host} 
														onChange={(e)=>setSearch_host(e.target.value)} 
														type="search_host" name="search_host" id="search_host" placeholder="Search"/>
													<p style= {{fontSize: "2.5vh", marginLeft: "1vw", marginTop:"0vh"}}>Seach:</p>
												</div>
											</div>
											
											
											
											
											
											<div style={{overflow: "hidden", display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												<div style={{position: "absolute", marginLeft: "1vw", marginTop: "0vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(var(--colorLightGray) 15%,  transparent 85%)", width: "50vw", height: "5vh"}}></div>
												<div  id = {"HostsMenu"} style={{width: "100%", height: "41vh", overflow: "hidden",}}>	
													{HostsFilter.map((el) => (
														<div onClick={() => {GetHost(el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 7vw 11vw 11vw 8vw 5vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "97%", alignItems: "center"}} key={el} value={el}>
															<div>{(parseInt(el[0] )+ 1) + "."}</div>
															<div>{el[1]['name']}</div>
															<div>Local: {el[1]['local']}</div>
															<div>Created by: {el[1]['created_by']}</div>
															<div>Group: {el[1]['group']}</div>
															<div>{el[1]['global']== true && <p>{'\u2713'}Global</p>}</div>
															
														</div>
														))}
													{HostsFilter.length == 0 &&
														<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
															There are no hosts
														</div>
													}
														
												</div>
												{HostsFilter.length != 0 &&
													<div onMouseMove= {() => {MouseMove()}} onMouseLeave=  {() => {setMouse("up")}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "0vw", }}>
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
												<div style={{position: "absolute", marginLeft: "1vw", marginTop: "37.1vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(transparent 35%,  var(--colorLightGray) 70%)", width: "50vw", height: "5vh"}}></div>
											</div>
											
											
											
											
											
											
											
											
											
										</div>
										}
										
										
									{host != "" &&
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >	
										<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit existing host  "{host[1]['name']}" :</p>
											<button className={"button_reset"} style= {{ marginLeft:"5vw"}} onClick= {()=>{Reset()}}>-> Back</button>
										</div>
										<div style={{width: "35vh", height: "35vw"}}>
											<div style= {{marginLeft: "2vw"}}>
												<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Name:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={name} 
														onChange={(e)=>setName(e.target.value)} 
														type="name" name="name" id="name_edit" placeholder="Name"/>
												</div>
												<div>
														<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Ip addres:</p>
														<input 
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "15vw"}}
															value={ip} 
															onChange={(e)=>setIp(e.target.value)} 
															type="ip" name="ip" id="ip_edit" placeholder="Ip addres"/>
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
																type="password" name="password" id="password_edit" placeholder="Password"/>
														</div>
												</div>
												<div style={{width: "50vw"}}>
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
												<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"2vw"}} onClick={()=>{saveData()}}>Save host</button>
											</div>
										</div>
								</div>}
								
								
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}