import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["About"];
	const [type, setType] = useState("About");
	const [selected_type, setSelected_type] = useState(type);

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
	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Main"} actions={actions} type = {type} setType={setType} indent={"56"}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "45vh"}}>

						<div  style = {{margin:"2vh", fontSize: "2vh"}}>
								<p style = {{display: "flex", justifyContent: "center", fontSize: "3vh"}}>Log panel:</p>
								<div  style = {{marginLeft:"0.5vw", marginTop: "0.5vh"}}>
										<div>
											<u> It's place to add your new host</u>
											<p> Write your data in input field</p>
											<p> Check it all attentively </p>
											<p> Group can be get off if input field contain "none" </p>
											<p> Global tag means everybody can see it </p>
											<p> Some errors will be will be written there but incorrect credentials can become error on lounch stage</p>
										</div>
								</div>
						</div>



						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>

							<div  style = {{ marginTop:"2vh", marginLeft:"3vh", position:"absolute", width:"100%"}}>
								<p>Awz site </p>
								<div  style = {{ fontSize:"2vh", marginTop:"0.5vh", marginLeft:"5vh", position:"absolute"}}>
									<p>It is project to control ansible by web system </p>
									<p>Created by Werzant </p>
									<p>Some Links </p>
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
