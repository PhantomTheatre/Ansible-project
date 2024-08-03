import React, { useState, useEffect, useRef } from "react";
import {  Link, router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["Enter", "Watch"];
	const [type, setType] = useState(actions[0]);
	const [selected_type, setSelected_type] = useState(type);
	
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	
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
	
	const Login = (e) => {
		e.preventDefault();
		router.post("/local/login", {name, password});
	};
	
	
	return (
		<Global.Provider value = {{user : props.user, local : props.local_name}}>
			<div>
				<Page_theme page={"User"} actions={actions} type = {type} setType={setType}/>
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
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Enter to exist local:</p>
										<div style= {{marginLeft: "2vw"}}>
											<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Name:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}}
														value={name} 
														onChange={(e)=>setName(e.target.value)} 
														type="name" name="name" id="name" placeholder="Name"/>
											</div>
											<div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"2vh"}}>Password:</p>
													<input 
														className={"text_field"}
														style= {{marginLeft: "1.5vw", width: "15vw"}} 
														value={password} 
														onChange={(e)=>setPassword(e.target.value)} 
														type="password" name="password" id="password" placeholder="Password"/>
											</div>
											<div>
												<button className={"button_submit"} style= {{fontSize: "2vh", marginTop: "3vh", marginLeft:"12vw"}} onClick={()=>{Login()}}>Enter</button>
											</div>
										</div>
									</div>
							</div>
							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
										<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Enter to exist local:</p>
										<div style= {{marginLeft: "2vw"}}>
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