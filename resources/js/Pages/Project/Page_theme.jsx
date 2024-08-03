import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, usePage } from '@inertiajs/react';
import '/resources/css/app.css';
import Global from './Global';
import Button from './button';

export default function Theme(props) {
	const { auth } = usePage().props;
	const { user, local } = useContext(Global);
	
	let self_object = useRef(null);
	
	const Hover = () => {
		document.getElementById("shadow").style.visibility = "visible";
		clearInterval(self_object.flow_right);
		if (parseInt(document.getElementById("menu").style.left) < 0) {
			self_object.flow_left = setInterval(() => {
				document.getElementById("menu").style.left = (((parseFloat(document.getElementById("menu").style.left)) + 0.5) + "vw");
				document.getElementById("shadow").style.opacity = ((parseFloat(document.getElementById("shadow").style.opacity)) + 0.012);
				if (parseInt(document.getElementById("menu").style.left) >= 0) {
					clearInterval(self_object.flow_left);
				}
			}, 10);
		}
	}
	const unHover = () => {
		document.getElementById("shadow").style.visibility = "collapse";
		clearInterval(self_object.flow_left);
		if (parseInt(document.getElementById("menu").style.left) > -13) {
			self_object.flow_right = setInterval(() => {
				document.getElementById("menu").style.left = (((parseFloat(document.getElementById("menu").style.left)) - 0.5) + "vw");
				document.getElementById("shadow").style.opacity = ((parseFloat(document.getElementById("shadow").style.opacity)) - 0.012);
				if (parseInt(document.getElementById("menu").style.left) <= -13) {
					clearInterval(self_object.flow_right);
				}
			}, 10);
		}
	}
	
	return (
		<div>
			<div style = {{ zIndex:"-1", position:"absolute", width:"100vw", height:"100vh", background: "var(--colorBackground)", top:"0"}}></div>
			<div style={{background: "var(--colorBrownGray)", display:"flex", height:"10vh" }}>
				<div style = {{flexDirection: "column", display:"flex", alignItems: "flex-end", width: "89vw",  fontSize: "2vh", justifyContent: "center", marginBottom: "1.6vh"}}>
					<h1>Selected user: {user}</h1>
					{local != "none" &&
						<h1>Selected local: {local}</h1>}
				</div>
				<div style = {{fontSize: "2vw", width: "9vw", marginLeft: "1vw", display:"flex", alignItems: "center", justifyContent: "center"}}>
					<h1>Awz site</h1>
				</div>
			</div>
			<div id="shadow" style = {{visibility: "collapse", zIndex:"5", position:"absolute", width:"100vw", height:"100vh", background: "gray", opacity:"0", top:"0"}}></div>
			<div id="menu" onMouseEnter={()=>Hover()}  onMouseLeave={()=>unHover()}  style = {{zIndex:"15",left: "-13vw", background: "var(--colorMenu)", position:"absolute", top:"0vh", width: "18vw", height: "100vh", }}>
				<div style = {{ fontSize: "3vw",  top:"0vh", width: "15vw", height: "20vh", marginTop: "5vh", display:"flex", justifyContent: "center"}}>
					<h1>Menu</h1>
				</div>
					<div style = {{fontSize: "1.5vw",  top:"0vh", width: "15vw", height: "20vh", marginLeft: "3vw", display:"flex", }}>
					<ul>
						<li><Link href="/">Main</Link></li>
						<li><Link href="/hosts">Hosts</Link></li>
						<li><Link href="/roles">Roles</Link></li>
						<li><Link href="/user">User</Link></li>
						<li><Link href="/local">Local</Link></li>
						<li><Link href="/play">Play</Link></li>
					</ul>
				</div>
			</div>
			<div style = {{display:"inline-grid", gridTemplateColumns: "55vw 20vw", width:"100vw"}}>
				<div style = {{marginLeft:"15vw",  fontSize: "6vh", }}>
					<h1 style = {{position: "relative", top: "4vh", left:"-1.5vw"}}>{props.page} Page</h1>
					<div style = {{ transform: "perspective(10vw) rotateX(-18deg)", width: "24vw", height: "6vh", borderRight: "solid", borderBottom: "solid", position: "relative", top: "-0.2vh", left: "-5vw", }}></div>
					<div style = {{ width: "58vw", height: "10vh", borderBottom: "solid", position: "absolute", top: "9vh", left: "34.6vw", }}></div>
				</div>
				<div style = {{  marginTop: "1vh", height: "7vh", fontSize: "4vh", display:"flex", justifyContent: "space-evenly"}}>
					{props.actions.map((el) => (
						<div key = {el}>
							<Button subject={el} type={props.type} end={(props.actions.indexOf(el) == props.actions.length-1)} setType= {props.setType} width={(15 + (el.length * 2)) + 'vh'}/>
						</div>
					))}
				</div>
			</div>
			
		</div>
	)
}
