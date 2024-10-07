import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = [props.user];
	const [type, setType] = useState(actions[0]);
	const [selected_type, setSelected_type] = useState(type);
	
	const [login, setLogin] = useState(props.db_user.login);
	const [password, setPassword] = useState(props.db_user.password);
	const [email, setEmail] = useState(props.db_user.email);
	
	const [typeEdit, setTypeEdit] = useState(false);
	
	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");
	
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
	
	
	useEffect(() => {
		if (type != selected_type) {
			Change();
			console.log(document.getElementById(selected_type).style.transform);
		}
	}, [type]);
	
	const SaveData = () => { 
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(login)) {new_errors.push("login_error")}
		regex = /^(?=.*[a-z]{2,})(?=.*[0-9]{2,})(.{0,15})$/i  ;
		if (!regex.test(password)) {new_errors.push("password_error")}
		regex = /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/g ;
		if (!regex.test(email)) {new_errors.push("email_error")}
		if (new_errors.length == 0) {
				router.post("/user/edit", {login, password, email});
				setSelected_error("");
				setErrors(['success'])
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	};
	
	
	const Delete = () => {
		router.post("/user/delete");
	};
	const Exit = () => {
		router.post("/user/exit");
	};
	
	return (
		<Global.Provider value = {{user : props.user, local : props.local}}>
			<div>
				<Page_theme page={"User"} actions={actions} type = {type} setType={setType}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "45vh"}}>
						
					

							<div  style = {{margin:"2vh", fontSize: "2vh"}}>
								<p style = {{display: "flex", justifyContent: "center", fontSize: "3vh"}}>Log panel:</p>
								<div  style = {{marginLeft:"0.5vw", marginTop: "0.5vh"}}>
									{errors.length == 0 ? (
										<div>
											<u> It's place to add your new host</u>
											<p> Write your data in input field</p>
											<p> Check it all attentively </p>
											<p> Group can be get off if input field contain "none" </p>
											<p> Global tag means everybody can see it </p>
											<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
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
											{selected_error == "file_error" && 
											<div>
												<p> It's error in "file" input field:</p>
												<p> You have to add some file </p>
												<p> or change type and write new </p>
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
										<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
											<p className={"stroke"} style={{fontSize: "3vh", color: "green", }}>Success edit</p>
										</div>
									)}
								</div>
							</div>
							
							
							
						
						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
								
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit user panel:</p>
										<div style= {{marginLeft: "2vw"}}>
											<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("login_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Login:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={login} 
														onChange={(e)=>setLogin(e.target.value)} 
														type="login" name="login" id="login" placeholder="Login"/>
											</div>
											
											<div>
												<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("password_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0.5vh"}}>Password:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={password} 
														onChange={(e)=>setPassword(e.target.value)} 
														type="password" name="password" id="password" placeholder="Password"/>
											</div>
											
											<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("email_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0.5vh"}}>Email:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={email} 
														onChange={(e)=>setEmail(e.target.value)} 
														type="email" name="email" id="email" placeholder="Email"/>
											</div>
										</div>
										<div style={{fontSize:"2.5vh", marginTop:"3.5vh"}}>
											<div style={{display: "flex", flexDirection: "inline"}}>
											<button className={"button_delete"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick= {()=>{Delete()}}>Delete</button>
											<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"5vw"}} onClick={()=>{Exit()}}>Exit</button>
											<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick={()=>{SaveData()}}>Save</button>
										</div>
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