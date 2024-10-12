import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';
import Editor from '@monaco-editor/react';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["Play", "Hosts", "Roles", "Logs"];
	const [type, setType] = useState(actions[0]);
	const [selected_type, setSelected_type] = useState(type);

	const [selectedHosts, setSelectedHosts] = useState([]);
	const [Hosts, setHosts] = useState(Object.entries(props.hosts));
	const [HostsFilter, setHostsFilter] = useState(Object.entries(props.hosts));

	const [selectedRoles, setSelectedRoles] = useState([]);
	const [Roles, setRoles] = useState(Object.entries(props.roles));
	const [RolesFilter, setRolesFilter] = useState(Object.entries(props.roles));

	const [Logs, setLogs] = useState(Object.entries(props.logs));
	const [LogsFilter, setLogsFilter] = useState(Object.entries(props.logs));
	const [code, setCode] = useState("a");
	const [logName, setLogName] = useState("a");

	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");

	const [search_host, setSearch_host] = useState("");
	const [single_on_host, setSingle_on_host] = useState(true);

	const [search_role, setSearch_role] = useState("");
	const [single_on_role, setSingle_on_role] = useState(true);

	const [log_type, setLog_type] = useState(false);

	const [mouse, setMouse] = useState("up");
	const MouseMove = () => {
		let min = 225;
		let max = 177;
		let size_of_block= 0.039;
		let fraction = ((event.pageY-(window.innerHeight*(min/524))) / (window.innerHeight*(max/524)) * 100);     // Проценты
		if (mouse == "down" && fraction<= 3) {
			Object.entries(document.getElementsByClassName("lazer_child")).forEach((el) => {
				el[1].style.top= 5+ 'px';
			});
		}
		else if (mouse == "down" && fraction>= 97) {
			Object.entries(document.getElementsByClassName("lazer_child")).forEach((el) => {
				el[1].style.top= window.innerHeight*((max -2)/524)+ 'px';
			});
		}
		else if (mouse == "down")  {
			Object.entries(document.getElementsByClassName("lazer_child")).forEach((el) => {
				el[1].style.top= (event.pageY-(window.innerHeight*((min+2)/524)))+ 'px';
				el[1].ondragstart = () => {return false;};
			});
			Object.entries(document.getElementsByClassName("shadow_top")).forEach((el) => {
				el[1].style.opacity = fraction/100*3
			});
			Object.entries(document.getElementsByClassName("shadow_bottom")).forEach((el) => {
				el[1].style.opacity = 1-(fraction/100*3)
			});
			Object.entries(document.getElementsByClassName("SelectMenu")).forEach((el) => {
				el[1].style.top = (-((fraction-5)/90*100) *el[1].children.length * window.innerHeight*size_of_block/100) + "px"
				console.log(el[1])
			});
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

	const HostsChange = (eve, el) => {
		if (single_on_host == true) {
			let index = selectedHosts.indexOf(el[1]["name"]);
			if  (index == -1) {  selectedHosts.push(el[1]["name"]);}
			else {delete selectedHosts[index];}
			eve.currentTarget.classList.toggle("selectedItem");
		} else {
			let index = selectedHosts.indexOf(el[0]);
			if  (index == -1) {  selectedHosts.push(el[0]);}
			else {delete selectedHosts[index];}
			eve.currentTarget.classList.toggle("selectedItem");
		}
	}
	const RolesChange = (eve, el) => {
		if (single_on_role == true) {
			let index = selectedRoles.indexOf(el[1]["name"]);
			if  (index == -1) {  selectedRoles.push(el[1]["name"]);}
			else {delete selectedRoles[index];}
			eve.currentTarget.classList.toggle("selectedItem");
		} else {
			let index = selectedRoles.indexOf(el[0]);
			if  (index == -1) {  selectedRoles.push(el[0]);}
			else {delete selectedRoles[index];}
			eve.currentTarget.classList.toggle("selectedItem");
		}
		console.log(selectedRoles)
	}
	const groupHostChange = () => {
		[...document.getElementsByClassName("toggle_host")].forEach((el)=> {
			el.classList.toggle("toggle_select")
		})
		setSingle_on_host(!single_on_host);
		setSelectedHosts([]);
		setSearch_host("");
		if (single_on_host == true) {
			let new_group_hosts = [];
			let new_group_hosts_final = {};
			[...Object.entries(props.hosts)].forEach((el) => {
				new_group_hosts.push(el[1]['group']);
			})
			new_group_hosts.forEach((el) => {
				if (! (el in new_group_hosts_final)) {new_group_hosts_final[el] = new_group_hosts.filter(x => x === el).length;}
			})
			setHosts(Object.entries(new_group_hosts_final));
			setHostsFilter(Object.entries(new_group_hosts_final));

		} else {
			setHosts(Object.entries(props.hosts));
			setHostsFilter(Object.entries(props.hosts));
		}

	}
	const groupRoleChange = () => {
		[...document.getElementsByClassName("toggle_role")].forEach((el)=> {
			el.classList.toggle("toggle_select")
		})
		setSingle_on_role(!single_on_role);
		setSelectedRoles([]);
		setSearch_role("");
		if (single_on_role == true) {
			let new_group_roles = [];
			let new_group_roles_final = {};
			[...Object.entries(props.roles)].forEach((el) => {
				new_group_roles.push(el[1]['group']);
			})
			new_group_roles.forEach((el) => {
				if (! (el in new_group_roles_final)) {new_group_roles_final[el] = new_group_roles.filter(x => x === el).length;}
			})
			setRoles(Object.entries(new_group_roles_final));
			setRolesFilter(Object.entries(new_group_roles_final));

		} else {
			setRoles(Object.entries(props.roles));
			setRolesFilter(Object.entries(props.roles));
		}

	}

	const LogChange = (el) => {
		setLog_type(true);
		setCode(el[1][0]);
		setLogName(el[1][1].slice(el[1][1].lastIndexOf('/')+1, -13) + " / " + el[1][1].slice(-12, -4));
	}

	useEffect(() => {
		Object.entries(document.getElementsByClassName("shadow_bottom")).forEach((el) => {
				if (el[1].parentElement.children[1].children.length <= 7 ){ el[1].style.visibility = "hidden"}
			});
		Object.entries(document.getElementsByClassName("shadow_top")).forEach((el) => {
				if (el[1].parentElement.children[1].children.length <= 7 ){ el[1].style.visibility = "hidden"}
			});
	}, []);

	useEffect(() => {
		if (type != selected_type) {
			Change();
		}
	}, [type]);

	useEffect(() => {
		if (search_host == "" && single_on_host==true) { setHostsFilter(Object.entries(props.hosts))}
		else if (search_host == "" && single_on_host==false) {setHostsFilter(Hosts)}
		else {
			let new_host_filter = [];
			Hosts.forEach((el) => {
				if (single_on_host==true) {
					if (el[1]['name'].toLowerCase().includes(search_host.toLowerCase())) { new_host_filter.push(el)}
				}
				else {
					if (el[0].toLowerCase().includes(search_host.toLowerCase())) { new_host_filter.push(el)}
				}
			});
			setHostsFilter(new_host_filter);
		}
	}, [search_host]);
	useEffect(() => {
		if (search_role == "" && single_on_role==true) { setRolesFilter(Object.entries(props.roles))}
		else if (search_role == "" && single_on_role==false) {setHostsFilter(Roles)}
		else {
			let new_role_filter = [];
			Roles.forEach((el) => {
				if (single_on_role==true) {
					if (el[1]['name'].toLowerCase().includes(search_role.toLowerCase())) { new_role_filter.push(el)}
				}
				else {
					if (el[0].toLowerCase().includes(search_role.toLowerCase())) { new_role_filter.push(el)}
				}
			});
			setRolesFilter(new_role_filter);
		}
	}, [search_role]);

	useEffect(() => {
		if (document.getElementById("HostMenu").children[0].classList.length != 0) {
			[...document.getElementById("HostMenu").children].forEach ((el) => {
				if (single_on_host == true) {
					if (selectedHosts.indexOf(Object.values(el)[1]['value'][1]['name']) != -1) {
						el.classList.add("selectedItem");
					} else {
						el.classList.remove("selectedItem");
					}
				} else {
					if (selectedHosts.indexOf(Object.values(el)[1]['value'][0]) != -1) {
						el.classList.add("selectedItem");
					} else {
						el.classList.remove("selectedItem");
					}
				}
			});
		}
	}, [HostsFilter]);

	useEffect(() => {
		if (document.getElementById("RoleMenu").children[0].classList.length != 0) {
			[...document.getElementById("RoleMenu").children].forEach ((el) => {
				if (single_on_role == true) {
					if (selectedRoles.indexOf(Object.values(el)[1]['value'][1]['name']) != -1) {
						el.classList.add("selectedItem");
					} else {
						el.classList.remove("selectedItem");
					}
				} else {
					if (selectedRoles.indexOf(Object.values(el)[1]['value'][0]) != -1) {
						el.classList.add("selectedItem");
					} else {
						el.classList.remove("selectedItem");
					}
				}
			});
		}
	}, [RolesFilter]);

	const Start = () => {

		let final_selectedHosts = [];
			Object.values(props.hosts).forEach((el) => {
				if ((single_on_host== true && selectedHosts.indexOf(el['name']) != -1) || (single_on_host== false && selectedHosts.indexOf(el['group']) != -1)) {
					final_selectedHosts.push(el['id'])
				}
			})
		let final_selectedRoles = [];
		Object.values(props.roles).forEach((el) => {
			if ((single_on_role== true && selectedRoles.indexOf(el['name']) != -1) || (single_on_role== false && selectedRoles.indexOf(el['group']) != -1)) {
				final_selectedRoles.push(el['id'])
			}
		})

		router.post("/play/launch", {final_selectedRoles, final_selectedHosts, single_on_role, single_on_host});
	};



	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Play"} actions={actions} type = {type} setType={setType} indent={"36"}/>
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
											) :  type == actions[1]  ? (
												<div>
													<u> It's place to edit yours host or  from local if your right it allows</u>
													<p> Select host you want to edit</p>
													<p> Write your data in input field</p>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											) :  type == actions[2]  ? (
												<div>
													<p> Write your data in input field</p>
													<p> Group can be get off if input field contain "none" </p>
													<p> Global tag means everybody can see it </p>
													<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
												</div>
											) : (
												<div>
													<u> Console to write code</u>
													<p> /Microsoft's Monaco editor/</p>
												</div>
											)}
										</div>
									) : (
										<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
											<p className={"stroke"} style={{fontSize: "3vh", color: "green", }}>Success edit</p>
											<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
										</div>
									)}
								</div>
							</div>





						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>

								<div style= {{ marginTop: "3vh", position: "absolute", width: "100%"}} >
										<p style= {{fontSize: "4vh", marginBottom: "3vh", display: "flex", justifyContent: "center", alignItems: "center", width:"100%"}}>Start your project</p>
										<div style= {{marginLeft: "2vw", display: "inline-grid", gridTemplateColumns: "46% 47%", width: "100%"}}>

											<div>
												<div style = {{borderRadius: "3% 25% 3% 3%", boxShadow: "-0.1vw 0vh 10px 5px var(--colorShadowBrownGray)",   background: "var(--colorLightGray)", height: "40vh"}}>
													<p style= {{fontSize: "3vh", display: "flex", alignItems: "center", width:"95%", marginLeft: "2vw", paddingTop: "1.5vh"}}>Selected Hosts</p>
													<div style={{borderRadius: "0 5px 0 0", background: "black", width: "24vw", height: "3px", marginLeft: "1.9vw", boxShadow: "0.1vw 0.2vh 0px 0.5px var(--colorShadowBrownGray)",}}></div>

															{ selectedHosts.filter(function () { return true }).length != 0 ? (
																<div style={{background: "transparent", width: "21.5vw", height: "28.5vh", margin: "2.1vh 2vw", boxShadow: "inset 0vw 0.2vh 10px 5px var(--colorShadowBrownGray)", display: "inline-grid", gridTemplateColumns: "12.5vw 9vw"}}>
																	<div style= {{fontSize: "2.3vh", marginLeft: "1.5vw", display: "flex", alignItems: "center", justifyContent: "center", padding: "3vh 0vw", }}>
																		<div style={{zIndex: "2", overflowY: "scroll", padding: "0.4vh", borderRadius: "5px 5px 5px 5px", display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", width: "100%", height: "23vh", boxShadow: "-0.2vw 0.2vh 3px 0px var(--colorShadowBrownGray)",   border:"solid 4px var(--colorShadowBrownGray)",}}>
																			{selectedHosts.map((el) => (
																			<div key = {el} style={{display: "flex", flexDirection: "column", alignItems: "center", }}>
																				<div>{el}</div>
																				<div style={{background: "black", width: "9vw", height: "2px"}}></div>
																			</div>
																			))}
																		</div>
																	</div>
																	<div style= {{fontSize: "2.5vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10vh"}}>
																		<div style={{borderRadius: "10px 2px 2px 2px", background: "transparent",  boxShadow: "-0.2vw 0.2vh 3px 0px var(--colorShadowBrownGray)",   border:"solid 4px var(--colorShadowBrownGray)", padding: "1vh 1vw", }}>
																			{single_on_host ? <p>Singe</p> : <p>Group</p>}
																		</div>
																	</div>
																</div>
															) : (
																<div style={{background: "transparent", width: "21.5vw", height: "28.5vh", margin: "2.1vh 2vw", boxShadow: "inset 0vw 0.2vh 10px 5px var(--colorShadowBrownGray)", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10vh"}}>
																	<div style={{fontSize: "2vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "12vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
																		Go to the /Hosts/ tab and select
																	</div>
																</div>
															)}


												</div>
											</div>

											<div>
												<div style = {{marginLeft: "2vh", borderRadius: "25% 3% 3% 3%", boxShadow: "-0.1vw 0vh 10px 5px var(--colorShadowBrownGray)",   background: "var(--colorLightGray)", height: "40vh"}}>
													<p style= {{fontSize: "3vh", display: "flex", flexDirection: "row-reverse", paddingRight: "2.5vw", alignItems: "center", width:"95%", marginLeft: "2vw", paddingTop: "1.5vh"}}>Selected Roles</p>
													<div style={{borderRadius: "5px 0 0 0", background: "black", width: "24vw", height: "3px", marginLeft: "0.4vw", boxShadow: "-0.1vw 0.2vh 0px 0.5px var(--colorShadowBrownGray)",}}></div>


														{ selectedRoles.filter(function () { return true }).length != 0 ? (
															<div style={{background: "transparent", width: "21.5vw", height: "28.5vh", margin: "2.1vh 2vw", boxShadow: "inset 0vw 0.2vh 10px 5px var(--colorShadowBrownGray)", display: "inline-grid", gridTemplateColumns: "8.5vw 11.5vw"}}>
																<div style= {{fontSize: "2.5vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10vh"}}>
																	<div style={{borderRadius: "2px 10px 2px 2px", background: "transparent",  boxShadow: "-0.2vw 0.2vh 3px 0px var(--colorShadowBrownGray)",   border:"solid 4px var(--colorShadowBrownGray)", padding: "1vh 1vw", }}>{single_on_role ? <p>Singe</p> : <p>Group</p>}</div>
																</div>
																<div style= {{fontSize: "2.3vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3vh 0vw", }}>
																	<div style={{zIndex: "2", overflowY: "scroll", padding: "0.4vh", borderRadius: "5px 5px 5px 5px", display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", width: "100%", height: "23vh", boxShadow: "-0.2vw 0.2vh 3px 0px var(--colorShadowBrownGray)",   border:"solid 4px var(--colorShadowBrownGray)",}}>
																		{selectedRoles.map((el) => (
																		<div key = {el} style={{display: "flex", flexDirection: "column", alignItems: "center", }}>
																			<div>{el}</div>
																			<div style={{background: "black", width: "9vw", height: "2px"}}></div>
																		</div>
																		))}
																	</div>
																</div>
															</div>
														) : (
															<div style={{background: "transparent", width: "21.5vw", height: "28.5vh", margin: "2.1vh 2vw", boxShadow: "inset 0vw 0.2vh 10px 5px var(--colorShadowBrownGray)", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "10vh"}}>
																<div style={{fontSize: "2vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "12vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
																	Go to the /Roles/ tab and select
																</div>
															</div>
														)}


												</div>
											</div>


										</div>
										<div style = {{position: "absolute", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center",  marginTop: "-20vh", marginLeft: "0.5vw"}}>
											<div style={{display: "flex", justifyContent: "center", alignItems: "center", width:"100%", height: "21vh", overflow: "hidden", position: "absolute", marginTop: "2.5vh", paddingTop: "15vh"}}>
												<div style = {{borderRadius: "100%",  marginLeft: "-0.5vw", position: "relative", width: "19vw", height: "30vh", background: "var(--colorLightGray)"}}>
												</div>
											</div>
											<div style = {{ overflow: "hidden", display: "flex", height: "20vh", width: "20vw", padding: "2vh 2vw", marginLeft: "-0.5vw"}}>
												<div style = {{borderRadius: "100%", boxShadow: "inset 0vw 0.2vh 8px 2px var(--colorShadowBrownGray)", right: "-9vw", marginTop: "3vh", background: "var(--colorLightGray)", height: "30vh", width: "18vw", position: "relative"}}>
												</div>
											</div>
											<div style = {{ overflow: "hidden", display: "flex", height: "20vh", width: "20vw", padding: "2vh 2vw", marginLeft: "1.2vw"}}>
												<div style = {{borderRadius: "100%", boxShadow: "inset 0vw 0.2vh 8px 2px var(--colorShadowBrownGray)", right: "9vw", marginTop: "3vh", background: "var(--colorLightGray)", height: "30vh", width: "18vw", position: "relative"}}>
												</div>
											</div>
										</div>
										<div style = {{position: "absolute", overflow: "hidden", display: "flex", height: "20vh", width: "21.5vw", padding: "2vh 2vw", marginLeft: "19vw", marginTop: "-14.5vh"}}>
											<div style = {{borderRadius: "100%", right: "9vw", marginTop: "-15vh", border:"solid 4px var(--colorShadowBrownGray)", height: "28vh", width: "100vw", position: "relative"}}>
											</div>
										</div>
										<div style = {{position: "absolute", overflow: "hidden", display: "flex", height: "20vh", width: "21.5vw", padding: "2vh 2vw", marginLeft: "17vw", marginTop: "-14.5vh"}}>
											<div style = {{borderRadius: "100%", right: "-9vw", marginTop: "-15vh", border:"solid 4px var(--colorShadowBrownGray)", height: "28vh", width: "100vw", position: "relative"}}>
											</div>
										</div>
										{ (selectedRoles.filter(function () { return true }).length != 0 &&  selectedHosts.filter(function () { return true }).length != 0)  ? (
											<div className={"button_submit"} onClick={() => Start()} style = {{cursor: "pointer", userSelect: "none", fontSize: "2.7vh", borderRadius: "14px 14px 29px 29px",  boxShadow: "0vw 0.5vh 2px 1px #004c00",  position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "7vh", width: "10vw",marginLeft: "23.9vw", marginTop: "-10vh"}}>
												<p >Start</p>
											</div>
										) : (
											<div style = {{userSelect: "none", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0.4vh 0.1vh 0.1vh var(--colorBrownGray)", background:"#8b8479", fontSize: "2.7vh", borderRadius: "14px 14px 29px 29px",  position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "7vh", width: "10vw",marginLeft: "23.9vw", marginTop: "-10vh"}}>
												<p >Start</p>
											</div>
										)}


							</div>



							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
								<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%"}} >
										<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
											<p style= {{fontSize: "3vh"}}>Your available hosts:</p>
											<div style={{display:"inline-flex", flexDirection: "row-reverse", width: "38vw", alignItems: "center"}}>
													<input
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "18vw"}}
														value={search_host}
														onChange={(e)=>setSearch_host(e.target.value)}
														type="search_host" name="search_host" id="search_host" placeholder="Search"/>
													<p style= {{fontSize: "2.5vh", marginLeft: "1vw", marginTop:"0vh"}}>Seach:</p>

													<div style={{display: "inline-flex"}}>
														<div onClick={() =>{groupHostChange()}} className ={"toggle toggle_host toggle_select text_field"} >
															<p>Single</p>
														</div>
														<div>
															<p style= {{fontSize: "3vh", margin: "0vh 0.2vw"}}> / </p>
														</div>
														<div onClick={() =>{groupHostChange()}}className ={"toggle toggle_host text_field"}>
															<p>Groupe</p>
														</div>
													</div>

											</div>
										</div>
										<div style={{overflow: "hidden", display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
											<div className={"shadow_top"} style={{zIndex: "5", opacity: "0", position: "absolute", marginLeft: "1.4vw", marginTop: "-2vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(var(--colorBrownGray) 6%,  transparent 70%)", width: "48vw", height: "4vh"}}></div>
											<div  id={"HostMenu"} className = {"SelectMenu"} style={{position: "relative", top: "0vh", width: "95%", height: "47vh",}}>
												{HostsFilter.map((el) => (
													single_on_host == true ? (
													<div onClick={(e) => {HostsChange(e, el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 7vw 11vw 11vw 8vw 5vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
														<div>{(HostsFilter.indexOf(el) +1) + "."}</div>
														<div>{el[1]['name']}</div>
														<div>Local: {el[1]['local']}</div>
														<div>Created by: {el[1]['created_by']}</div>
														<div>Group: {el[1]['group']}</div>
														<div>{el[1]['global']== true && <p>{'\u2713'}Global</p>}</div>

													</div>
													) : (
														<div onClick={(e) => {HostsChange(e, el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 25vw 17vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
															<div>{(HostsFilter.indexOf(el) +1) + "."}</div>
															<div>{el[0]}</div>
															<div>Number of hosts in the group: {el[1]}</div>
														</div>
													)
													))
												}
												{HostsFilter.length == 0 &&
													<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
														There are no members available with the selected filter
													</div>
												}

											</div>
											{HostsFilter.length != 0 &&
												<div onMouseMove= {() => {MouseMove()}} onMouseLeave=  {() => {setMouse("up")}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "1.1vw", }}>
													<div style={{border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", height: "40vh", width: "40%",position: "relative", }} >
														<div
															onMouseDown= {() => {setMouse("down")}}
															onMouseUp= {() => {setMouse("up")}}
															className={"lazer_child"}
															style={{position: "absolute", top:"0px", boxShadow: "-0.1vh 0.1vh 0.1vh 0vh var(--colorBrownGray)", border: "2px solid var(--colorShadowBrownGray)", background: "white",  width: "100%", height: "5vh", position: "relative"}}>

															<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "30%"}}></div>
															<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "50%"}}></div>
														</div>
													</div>
												</div>
											}
											<div className={"shadow_bottom"} style={{visibility: "visible", zIndex: "5", opacity: "1", position: "absolute",  marginLeft: "1.4vw", marginTop: "38.5vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(transparent 30%,  var(--colorBrownGray) 95%)", width: "48vw", height: "4vh"}}></div>
									</div>
								</div>


							</div>
							<div id = {actions[2]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-120vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>



								<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%"}} >
											<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
												<p style= {{fontSize: "3vh"}}>Your available roles:</p>
												<div style={{display:"inline-flex", flexDirection: "row-reverse", width: "38vw", alignItems: "center"}}>
														<input
															className={"text_field"}
															style= {{marginLeft: "1.5vw", width: "18vw"}}
															value={search_role}
															onChange={(e)=>setSearch_role(e.target.value)}
															type="search" name="search" id="search" placeholder="Search"/>
														<p style= {{fontSize: "2.5vh", marginLeft: "1vw", marginTop:"0vh"}}>Seach:</p>

														<div style={{display: "inline-flex"}}>
															<div onClick={() =>{groupRoleChange()}} className ={"toggle toggle_role toggle_select text_field"} >
																<p>Single</p>
															</div>
															<div>
																<p style= {{fontSize: "3vh", margin: "0vh 0.2vw"}}> / </p>
															</div>
															<div onClick={() =>{groupRoleChange()}}className ={"toggle toggle_role text_field"}>
																<p>Groupe</p>
															</div>
														</div>

												</div>
											</div>
											<div style={{overflow: "hidden", display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												<div className={"shadow_top"} style={{zIndex: "5", opacity: "0", position: "absolute", marginLeft: "1.4vw", marginTop: "-2vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(var(--colorBrownGray) 6%,  transparent 70%)", width: "48vw", height: "4vh"}}></div>
												<div  id = {"RoleMenu"} className = {"SelectMenu"} style={{position: "relative", top: "0vh", width: "95%", height: "47vh",}}>
													{RolesFilter.map((el) => (
														single_on_role == true ? (
														<div onClick={(e) => {RolesChange(e, el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 7vw 11vw 11vw 8vw 5vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
															<div>{(RolesFilter.indexOf(el) +1) + "."}</div>
															<div>{el[1]['name']}</div>
															<div>Local: {el[1]['local']}</div>
															<div>Created by: {el[1]['created_by']}</div>
															<div>Group: {el[1]['group']}</div>
															<div>{el[1]['global']== "true" && <p>{'\u2713'}Global</p>}</div>

														</div>
														) : (
															<div onClick={(e) => {RolesChange(e, el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 25vw 17vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
																<div>{(RolesFilter.indexOf(el) +1) + "."}</div>
																<div>{el[0]}</div>
																<div>Number of roles in the group: {el[1]}</div>
															</div>
														)
														))
													}
													{RolesFilter.length == 0 &&
														<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
															There are no roles available with the selected filter
														</div>
													}

												</div>
												{RolesFilter.length != 0 &&
													<div onMouseMove= {() => {MouseMove()}} onMouseLeave=  {() => {setMouse("up")}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "1.1vw", }}>
														<div style={{border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", height: "40vh", width: "40%",position: "relative", }} >
															<div
																onMouseDown= {() => {setMouse("down")}}
																onMouseUp= {() => {setMouse("up")}}
																className={"lazer_child"}
																style={{position: "absolute", top:"0px", boxShadow: "-0.1vh 0.1vh 0.1vh 0vh var(--colorBrownGray)", border: "2px solid var(--colorShadowBrownGray)", background: "white",  width: "100%", height: "5vh", position: "relative"}}>

																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "30%"}}></div>
																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "50%"}}></div>
															</div>
														</div>
													</div>
												}
												<div className={"shadow_bottom"} style={{visibility: "visible", zIndex: "5", opacity: "1", position: "absolute",  marginLeft: "1.4vw", marginTop: "38.5vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(transparent 30%,  var(--colorBrownGray) 95%)", width: "48vw", height: "4vh"}}></div>
										</div>
									</div>





							</div>
							<div id = {actions[3]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-180vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>



								{ !log_type ? (
									<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%"}} >
											<div style={{display:"inline-flex", marginBottom: "0.8vh"}}>
												<p style= {{fontSize: "3vh"}}>Your logs:</p>
											</div>
											<div style={{overflow: "hidden", display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												<div className={"shadow_top"} style={{zIndex: "5", opacity: "0", position: "absolute", marginLeft: "1.4vw", marginTop: "-2vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(var(--colorBrownGray) 6%,  transparent 70%)", width: "48vw", height: "4vh"}}></div>
												<div  id = {"LogsMenu"} className = {"SelectMenu"} style={{position: "relative", top: "0vh", width: "95%", height: "47vh",}}>
													{LogsFilter.map((el) => (
														<div onClick={() => {LogChange(el)}} className={"item"} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: '2vw 6vw 6vw 1.5vw 9vw', margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", alignItems: "center"}} key={el} value={el}>
															<div>{el[0] + "."}</div>
															<div>Log from </div>
															<div>{el[1][1].slice(el[1][1].lastIndexOf('/')+1, -13) }</div>
															<div>/</div>
															<div>{el[1][1].slice(-12, -4)}</div>

														</div>
														))}
													{LogsFilter.length == 0 &&
														<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
															There are no logs
														</div>
													}

												</div>
												{LogsFilter.length != 0 &&
													<div onMouseMove= {() => {MouseMove()}} onMouseLeave=  {() => {setMouse("up")}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "1.1vw", }}>
														<div style={{border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", height: "40vh", width: "40%",position: "relative", }} >
															<div
																onMouseDown= {() => {setMouse("down")}}
																onMouseUp= {() => {setMouse("up")}}
																className={"lazer_child"}
																style={{position: "absolute", top:"0px", boxShadow: "-0.1vh 0.1vh 0.1vh 0vh var(--colorBrownGray)", border: "2px solid var(--colorShadowBrownGray)", background: "white",  width: "100%", height: "5vh", position: "relative"}}>

																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "30%"}}></div>
																<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "50%"}}></div>
															</div>
														</div>
													</div>
												}
												<div className={"shadow_bottom"} style={{visibility: "visible", zIndex: "5", opacity: "1", position: "absolute",  marginLeft: "1.4vw", marginTop: "38.5vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(transparent 30%,  var(--colorBrownGray) 95%)", width: "48vw", height: "4vh"}}></div>
										</div>
									</div>
								) : (
								<div style={{borderRadius: "5vh", padding: "3vh 2vw", width: "100%", height: "100%"}}>
										<div style={{marginBottom: "1.5vh", display: "inline-flex", fontSize: "2.5vh"}}>
											<p style={{marginRight: "1vw"}}>- Log from </p>
											<p>{logName}</p>
											<div style={{display: "flex", flexDirection: "row-reverse", width: "27vw"}}>
												<button className={"button_reset"} style={{maxHeight: "4vh", paddingTop: "0vh"}} onClick={() => {setLog_type(false)}}>-> Back to menu</button>
											</div>
										</div>
										<div style={{border: "3px solid var(--colorShadowBrownGray)", boxShadow: "-0.9vh 0.4vh 0.5vh 0.1vh var(--colorBrownGray)", width: "100%", height: "90%", }}>
											<Editor
												options={{
													fontSize: "13vh",
													wordWrap: "on",
												}}
												theme="vs-dark"
												height="100%"
												width="100%"
												defaultLanguage="plaintext"
												value={code} />
										</div>
									</div>
								)}





							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}
