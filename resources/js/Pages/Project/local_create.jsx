import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Finder from './finder';
import Button_check from './Button_check';

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

    const [Filter, setFilter]=  useState({"admin": true, "write": true,  "read": true,  "global": true,  "banned": false});
    const [members, setMembers]=  useState("");

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
		console.log(props.locals);
	}, []);

	const Enter = () => {
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(name)) {new_errors.push("name_error")}
		regex = /^(?=.*[a-z]{2,})(?=.*[0-9]{2,})(.{0,15})$/i  ;
		if (!regex.test(password)) {new_errors.push("password_error")}
		if (new_errors.length == 0) {
            if (local == ""){
                router.post("/local/login", {name, password});
            } else{
                let name_post = local[0]
                router.post("/local/edit", {name, password, name_post});
            }
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

    const Delete = () => {
        let name_post = local[0]
		router.post("/local/delete", {name_post});
	};
    const Exit = () => {
        let name_post = local[0]
		router.post("/local/exit", {name_post});
	};
    const SaveMembers = () => {
        let name_post = local[0]
		router.post("/local/members", {name_post, members});
	};

	const GetLocal = (el) => {
		setLocal(Object.values(el))
        setMembers(props.locals[el['Name']]['members']);

	};

	const Back = () => {
		setLocal("")
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

	const ApplyFilter = () => {
		let new_members = {};
		Object.entries(members).map((el) => {
			if (Filter[el[1]]) {new_members[el[0]]=el[1] }
		});
        setLocal([local[0],local[1], new_members, local[3]])

	}
	const ChangeValue = (key, value) => {
		let new_members = {...members};
        new_members[key[0]] = value;
        setMembers(new_members);
	}

    useEffect(() => {
		ApplyFilter()
	}, [members]);



	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Locals"} actions={actions} type = {type} setType={setType} indent={"38"}/>
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
									<div class={"lineBig"}style={{position: "absolute", width: "0.8vw", height: "92%",  margin: "2vh 0vw 2vh 27.5vw", }}></div>
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
												cats={['Name', 'Right', 'Count-of-members']}
												grid_columns={'2vw 12vw 12vw 12vw 9vw 5vw'}
												empty_label={"There are no hosts"}
												select_function={GetLocal}/>
										) : (
											<div>
												{ local_type == "members" ? (



													<div style= {{paddingLeft: "2vw", paddingTop: "4vh", position: "absolute", width: "96.5%"}} >
                                                        <div style={{display:"inline-grid", paddingBottom: "1vh", gridTemplateColumns: "10vw 23vw 10vw 7.5vw"}}>
                                                            <button className={"button_reset"} style= {{fontSize: "2vh", width: "7vw"}} onClick={()=>{setLocal_Type("menu")}}>{"<- Back"}</button>
                                                            <p style= {{fontSize: "3vh"}}>Members of this local:</p>
                                                            <button className={"button_reset"} style={{marginRight: "4vw"}}onClick={()=>{setMembers(props.locals[local[0]]['members'])}}>Reset</button>
                                                            <button className={"button_submit"} onClick={()=>{SaveMembers()}}>Save all</button>
                                                        </div>
                                                        <div style={{display: "inline-flex", background:"transparent",  width: "100%", height: "44vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
                                                            <div  style={{width: "95%", height: "47vh",}}>
                                                                    {Object.entries(local[2]).map((el) => (
                                                                    <div style={{display: "grid", gridTemplateColumns: '2vw 28vw 5vw 3vw', border: "2px solid var(--colorShadowBrownGray)", background: "#8b8479", margin: "0.5vh 1.5vw", padding: "0.8vh", width: "100%", fontSize: "2.5vh", alignItems: "center"}} key={el} value={el}>
                                                                        <div>
                                                                            {(Object.keys(local[2]).indexOf(el[0]) +1) + "."}
                                                                        </div>
                                                                        <div>
                                                                            {el[0]}
                                                                        </div>
                                                                        <div>
                                                                            Right:
                                                                        </div>
                                                                        <div>
                                                                            <select id= {el[0]} defaultValue={el[1]} className={"select"} onChange={(e) => {ChangeValue(el, e.target.value); ApplyFilter()}}>
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
                                                                    {Object.keys(local[2]).length == 0 &&
                                                                        <div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "96%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
                                                                            There are no members available with the selected filter
                                                                        </div>
                                                                    }

                                                            </div>
                                                            {Object.keys(local[2]).length != 0 &&
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
																	<button className={"button_reset"} style= {{width: "1vw", height: "3.5vh", margin: "0.5vh 0.5vw", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={()=>{setName(local[0])}}  dangerouslySetInnerHTML={{ __html:  '<div> &#8635;</div>'}} ></button>
																</div>
														</div>
														<div>
																<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("password_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
																<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Password:</p>
																<div style={{display: "inline-flex"}}>
                                                                    <input
                                                                        className={"text_field"}
                                                                        style= {{marginLeft: "1.5vw", width: "15vw"}}
                                                                        value={password}
                                                                        onChange={(e)=>setPassword(e.target.value)}
                                                                        type="password" name="password" id="password2" placeholder="Password"/>
                                                                    <button className={"button_reset"} style= {{width: "1vw", height: "3.5vh", margin: "0.5vh 0.5vw", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={()=>{setPassword(local[3])}}  dangerouslySetInnerHTML={{ __html:  '<div> &#8635;</div>'}} ></button>
                                                                </div>
														</div>
														<div style ={{display: "inline-flex", justifyContent: "space-between", width: "18vw"}}>
															<button className={"button_delete"} style= {{width: "5vw", height: "4.5vh", marginTop: "7vh", marginLeft:"1vw"}} onClick= {()=>{Delete()}}>Delete</button>
															<button className={"button_submit"} style= {{width: "5vw", height: "4.5vh", marginTop: "7vh", marginLeft:"3vw"}} onClick={()=>{Enter()}}>Save</button>
														</div>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "-39.2vh", marginRight: "44vw", width: "7vw"}} onClick={()=>{setLocal_Type("menu")}}>{"<- Back"}</button>

													</div>
												) : (
													<div style={{padding: "5vh 0vw 0vh 7.5vw", display: "flex", flexDirection: "column", width: "50vw", height: "50vh", alignItems: "center"}}>
														<b style={{fontSize: "5vh"}}>Edit menu</b>
														<div style={{fontSize: "4vh", display: "inline-flex"}}><p>Local: </p><u style={{paddingLeft: "0.6vw"}}>{local[0]}</u></div>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "3vh", width: "30vw"}} onClick={()=>{setLocal_Type("edit"); setName(local[0]); setPassword(local[3]), console.log(local)}}>{"Edit Local ->"}</button>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "3vh", width: "35vw"}} onClick={()=>{setLocal_Type("members")}}>{"Edit Members ->"}</button>
														<button className={"button_delete"} style= {{fontSize: "2vh", marginTop: "10vh", width: "10vw"}} onClick={()=>{Exit()}}>{"Exit"}</button>
														<button className={"button_reset"} style= {{fontSize: "2vh", marginTop: "-41vh", marginRight: "44vw", width: "7vw"}} onClick={()=>{setLocal("")}}>{"<- Back"}</button>
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
