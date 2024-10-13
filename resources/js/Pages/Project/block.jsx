import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	const actions = ["Block"];
	const [type, setType] = useState("Block");

	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Block"} actions={actions} type = {type} setType={setType} indent={"56"}/>
				<div  style = {{ position: "absolute", marginLeft:"11vw", marginTop:"2vh", height: "67vh", width: "85vw", background: "var(--colorBrownGray)", borderRadius: "5% 5% 5% 20%", boxShadow: "-2vw 2.5vh 10px 1px var(--colorShadowBackground)"}}>
					<div style = {{ overflow: "hidden", position: "relative", marginLeft:"2vw", marginTop:"3vh", height: "63vh", width: "81vw", display:"grid", gridTemplateColumns: "20vw 60vw"}}>
						<div style = {{marginLeft: "2vw", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", position: "relative", background: "var(--colorLightGray)", height: "45vh"}}>

						<div  style = {{margin:"2vh", fontSize: "2vh", display: "flex", flexDirection: "column",  alignItems: "center",}}>
								<p style = {{ fontSize: "3vh"}}>Log panel:</p>
								<b style = {{ fontSize: "3vh", marginTop: "2vh"}}>We can't identify you</b>
						</div>



						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>

                                <div style={{display:"flex",alignItems:"center", flexDirection: "column"}}>
                                    <p style = {{ fontSize: "3vh", marginTop: "5vh"}}>You see this page because you have to log in to work with this site</p>
                                    <button className={"button_submit"} style= {{width:"25vw", marginTop: "3vh", fontSize: "3vh"}} onClick={()=>{window.location.href = '/user';}}>{"-> Login or Registration"}</button>
                               </div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</Global.Provider>
	)
}
