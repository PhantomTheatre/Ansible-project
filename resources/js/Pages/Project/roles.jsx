import React, { useState, useEffect, useRef } from "react";
import {Link,  router, usePage} from '@inertiajs/react';
import Page_theme from './Page_theme.jsx';
import '/resources/css/app.css';
import Global from './Global';
import Button_check from './Button_check';
import Finder from './finder';
import Editor from '@monaco-editor/react';

export default function Roles(props) {
	const { auth } = usePage().props;
	const actions = ["create", "edit", "code"];
	const [type, setType] = useState("create");
	const [selected_type, setSelected_type] = useState(type);

	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [task, setTask] = useState("");
	const [global_, setGlobal] = useState(false);
	const [typeFile, setTypeFile] = useState("file");
	const [code, setCode] = useState("// some comment");
	const [id, setId] = useState("");
	const [group_on, setGroup_on] = useState(false);


	const [role, setRole] = useState("");
	const [Roles, setRoles] = useState("");

	const [errors, setErrors] = useState([]);
	const [selected_error, setSelected_error] = useState("");

	const GetRole = (el) =>{
		setRole(el);
		setName(el.name);
		setGroup(el.group);
		setGlobal(Boolean(parseInt(el.global)));
		setCode(props.codes[el.id]);
		setId(el.id);
		setTypeFile("write");
		setTask(task);
		setSelected_error("");
		setErrors([]);
		if (el.group != "none") {
			setGroup_on(true)
		} else{setGroup_on(false)}
	};

	const Reset = () => {
				setRole("");
				setName("");
				setGroup("none");
				setGlobal(false);
				setGroup_on(false);
				setId("");
				setTypeFile("file");
				setTask("")
				setCode("// some comment" );
				setSelected_error("");
				setErrors([]);
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
			if (document.getElementById(selected_type).style.opacity == 0.5 && ((selected_type != "code" && type != "code") || (type == "edit" && selected_type == "code"  && role == "" ) || (type == "create" && selected_type == "code"  && role != "" ) )) { Reset(); }
			if (document.getElementById(selected_type).style.opacity <= 0) {
				clearInterval(self_object.change_flow);
				document.getElementById(selected_type).style.visibility = "collapse";
				setSelected_type(type);
			}
		}, 10);
	}
	const Delete = () => {
		router.post("/roles/delete", { id });
		let new_name=name;
		Reset()
		setErrors(['success', 'success_create', new_name]);
	};
	const saveData = () => {
		let new_errors = [];
		let regex = /^((?!.*\s\s)[0-9a-z]([0-9a-z\s\-\_]{1,13})[0-9a-z])$/i  ;
		if (!regex.test(name)) {new_errors.push("name_error")}
		if (group_on && !regex.test(group)) {new_errors.push("group_error")}
		if (typeFile == "file" && task== "" && type=="create") {new_errors.push("file_error")}
		if (new_errors.length == 0) {
			if (type == "create") {
				const formData = new FormData();
				formData.append('file', task);
				setTask(formData);

                let new_locals=[]
                document.querySelectorAll(".m-selectorS").forEach((el) => {
                    new_locals.push(el.getAttribute('data'))
                    el.classList.toggle("m-selectorS")
                })

				router.post("/roles/save", {name, group, task, type, code, global_, new_locals}, {forceFormData: true,});
				let new_name=name;
				Reset()
				setErrors(['success', 'Success create', new_name]);
			} else {
				router.post("/roles/edit", {name, group, task, type, code, global_, id}, {forceFormData: true,});
				let new_name=name;
				Reset()
				setErrors(['success', 'Success edit', new_name]);
			}
		} else {
			if (errors.toString() != new_errors.toString()) {
				setSelected_error("");
				setErrors(new_errors);
			}
		}
	};

    const ChangeLocals = (el) =>{
        el.currentTarget.classList.toggle("m-selectorS")
    };

	useEffect(() => {
		if (type != selected_type) {
			Change();
			console.log(document.getElementById(selected_type).style.transform);
		}
	}, [type]);
	useEffect(() => {
		if (task != "") {
			var reader = new FileReader();
			reader.readAsText(task);
			reader.onload = () => {setCode(reader.result)};
		}
	}, [task]);

	useEffect(() => {
		if (typeFile == "file" || (typeFile == "write" && type == "create")) {
			setCode("// some comment" );
			setTask("");
		} else if (typeFile == "write" && type == "edit") {
            console.log(Object.entries(props.roles));
			Object.entries(props.roles).forEach((el) =>{
				if (id == el[1].id) {
					setCode(props.codes[el[1].id]);
					setTask(task);
				};
			});
		}
	}, [typeFile]);

	useEffect(() => {
		if (!group_on) { setGroup("none")}
		else if (type=="create") {setGroup("")}
		else if (type=="edit" && role['group'] != "none") {setGroup(role['group'])}
		else if (type=="edit" && role['group'] == "none") {setGroup("")}
	}, [group_on]);

	useEffect(() => {
		setRoles(Object.entries(props.roles));
	}, [props]);

	return (
		<Global.Provider value = {{user : props.auth.user, local : props.auth.local}}>
			<div>
				<Page_theme page={"Roles"} actions={actions} type = {type} setType={setType} indent={"43"}/>
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
										<div>
										{errors[1] == 'success_create' ? (
											<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
												<p className={"stroke"} style={{fontSize: "3.5vh", color: "green", }}>Success create</p>
												<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
											</div>
										) : (
											<div style={{height: "20vh", margin: "1.5vh 0 0 -0.5vw", background: "var(--colorInfo)", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-0.5vw"}}>
													<p className={"stroke"} style={{fontSize: "3.5vh", color: "green", }}>{errors[1]}</p>
													<u style={{fontSize: "2.3vh"}}>{errors[2]}</u>
													<div style={{position: "relative", display: "flex", flexDirection: "column-reverse", height: "8vh"}}>
														<button className={"button_submit"} style= {{ marginLeft:"8vw"}} onClick= {()=>{setErrors(""); setSelected_error("") }}>Well</button>
													</div>
												</div>
											</div>
										)}
										</div>
									)}
								</div>
							</div>



						</div>
						<div style = {{marginLeft: "3vw"}}>
							<div id = {actions[0]} style = {{borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "left ", opacity: "1", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>

								<div style= {{marginLeft: "3vw", marginTop: "3vh", position: "absolute"}} >
										<div style= {{display: "flex", flexDirection: "inline"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Create new role</p>
												<input
													className={"text_field"}
													value={name}
													onChange={(e)=>setName(e.target.value)}
													type="name" name="name" id="name" placeholder="Name"/>
											<p style= {{fontSize: "3vh", marginLeft: "1vw"}}>:</p>
											<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "5vh", background: "red"}}></div>
										</div>
											<div style= {{marginLeft: "1vw", }}>
												<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"3vh"}}>Select type of task create:</p>
													<select className={"select"} value={typeFile} style={{marginTop: "3vh"}}  onChange={(e)=>setTypeFile(e.target.value)}>
														<option disabled>Type</option>
														<option value="file">File</option>
														<option value="write">Write</option>
													</select>
												</div>

													{typeFile== "file"? (
														<div style={{marginTop:"1vh", marginLeft: "2vw"}}>
															<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("file_error") ? ("visible") : ("collapse"), position: "absolute", width: "77%", height: "7vh", background: "red"}}></div>
															<input
																accept={".yml"}
																style={{ opacity: "0", width: "25vw", height:"4vh", position: "absolute", cursor: "pointer"}}
																onChange={(e)=>setTask(e.target.files[0])}
																type="file" name="task" id="task"/>
															<div className={"select"} style={{marginTop: "2vh", background: "#e2e0de", height:"4vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
																{ task == "" ?
																<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Browse your file</p>
																: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Change</p>}
															</div>
															{ task == "" ?
															<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Load your file task here</p>
															: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Loaded file: {task.name}</p>}
														</div>
													) : (
														<div style={{border: "2px solid var(--colorShadowBrownGray)", margin: "2.48vh 0vh 2.5vh 1vh", background: "#8b8479", height:"5vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
															<p style= {{fontSize: "2vh"}}>Write your code in /code/ tab</p>
														</div>
													)}

												<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("group_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"1vh"}}>Group:</p>
													<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
														<input
															disabled = {!group_on}
															style= {{marginLeft: "1.5vw", marginTop:"0.5vh",width: "15vw"}}
															className={"text_field"}
															value={group}
															onChange={(e)=>setGroup(e.target.value)}
															type="group" name="group" id="group" placeholder="Name of group"/>
														<Button_check setValue={setGroup_on} value={group_on} label={"Add role to some group"}/>
													</div>
												</div>
												<div style={{marginTop: "3vh"}}>
													<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this role"}/>
												</div>
												<div>
													<button className={"button_submit"} style= {{width: "19vw", height: "5vh", fontSize: "3vh", marginTop: "6vh", marginLeft:"2vw"}} onClick={()=>{saveData()}}>Create role</button>
												</div>
											</div>
									</div>

									<div style= {{width: "12vw", position:"absolute", fontSize: "2.3vh", marginLeft: "40vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3vh 0vw", }}>
                                        <div class = {"lineBig"}style = {{position: "absolute", width: "0.8vw",height:"43vh", margin:"15vh 12vw 0vh 0vw"}}></div>
                                        <div style = {{position: "relative", width: "15vw", textAlign: "right", fontSize: "4vh"}}><b>Select locals</b></div>
                                        <div style={{ marginLeft: "3vw", width: "10vw", overflowY: "scroll", padding: "0.4vh", borderRadius: "5px 5px 5px 5px", display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", width: "100%", height: "23vh", boxShadow: "-0.2vw 0.2vh 3px 0px var(--colorShadowBrownGray)",   border:"solid 4px var(--colorShadowBrownGray)",}}>
                                            <div class={"m-selector"} data = {"none"} onClick={(e)=>{ChangeLocals(e)}}>//User//</div>
                                            <div style={{background: "black", width: "10vw", height: "2px"}}></div>
                                            {props.locals.map((el) => (
                                                <div key = {el} style={{display: "flex", flexDirection: "column", alignItems: "center", }}>
                                                    <div class={"m-selector"} data = {el} onClick={(e)=>{ChangeLocals(e)}}>{el}</div>
                                                    <div style={{background: "black", width: "10vw", height: "2px"}}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


							</div>

							<div id = {actions[1]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-60vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>



									{role == "" &&
										<Finder name_of_table={"Your roles"}
											objects={props.roles}
											cats={['name', 'local', 'created_by', 'group', 'global']}
											grid_columns={'2vw 7vw 11vw 11vw 8vw 5vw'}
											empty_label={"There are no roles"}
											select_function={GetRole}/>
									}


									{role != "" &&
									<div style= {{marginLeft: "2vw", marginTop: "3vh", position: "absolute"}} >
										<div style= {{display: "flex", flexDirection: "inline", alignItems: "center"}}>
											<p style= {{fontSize: "3vh", marginRight: "1vw"}}>Edit existing role  "{role['name']}" :</p>
											<button className={"button_reset"} style= {{ marginLeft:"5vw"}} onClick= {()=>{Reset()}}>-> Back</button>
										</div>
										<div style={{width: "35vh", height: "35vw"}}>
											<div style= {{marginLeft: "2vw"}}>
													<div style= {{marginLeft: "1vw", }}>
												<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("name_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginTop:"0.5vh"}}>Name:</p>
													<input
														style= {{fontSize: "2vh", marginLeft: "2vw"}}
														className={"text_field"}
														value={name}
														onChange={(e)=>setName(e.target.value)}
														type="name" name="name" id="name" placeholder="Name"/>
												</div>
												<div style= {{display: "flex", flexDirection: "inline", alignItems: "center", width: "45vw"}}>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"1.5vh"}}>Select type of task create:</p>
													<select className={"select"} value={typeFile} style={{marginTop: "1.5vh"}}  onChange={(e)=>setTypeFile(e.target.value)}>
														<option disabled>Type</option>
														<option value="file">File</option>
														<option value="write">Write</option>
													</select>
												</div>

													{typeFile== "file"? (
														<div style={{marginTop:"1vh", marginLeft: "2vw"}}>
															<input
																accept={".yml"}
																style={{ opacity: "0", width: "25vw", height:"4vh", position: "absolute", cursor: "pointer"}}
																onChange={(e)=>setTask(e.target.files[0])}
																type="file" name="task" id="task"/>
															<div className={"select"} style={{marginTop: "0.5vh", background: "#e2e0de", height:"4vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
																{ task == "" ?
																<p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Browse your file</p>
																: <p style= {{fontSize: "2vh", marginLeft: "1vw"}}>Change</p>}
															</div>
															{ task == "" ?
															<p style= {{fontSize: "2vh", marginLeft: "1vw",  width: "25vw"}}>You can load other file to change exist</p>
															: <p style= {{fontSize: "2vh", marginLeft: "1vw", width: "25vw"}}>Loaded file: {task.name}</p>}
														</div>
													) : (
														<div style={{border: "2px solid var(--colorShadowBrownGray)", margin: "1.48vh 0vh 1.5vh 1vh", background: "#8b8479", height:"5vh", width: "25vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
															<p style= {{fontSize: "2vh"}}>Edit your code in /code/ tab</p>
														</div>
													)}

												<div>
													<div style={{zIndex: "-1", opacity: "0.5", marginLeft: "-0.5vw", visibility: errors.includes("group_error") ? ("visible") : ("collapse"), position: "absolute", width: "130%", height: "4vh", background: "red"}}></div>
													<p style= {{fontSize: "2.5vh", marginRight: "1vw", marginTop:"0vh"}}>Group:</p>
													<div style= {{display: "flex", flexDirection: "inline", alignItems: "center", width: "45vw"}}>
														<input
															disabled = {!group_on}
															style= {{marginLeft: "1.5vw", marginTop:"0.5vh",width: "15vw"}}
															className={"text_field"}
															value={group}
															onChange={(e)=>setGroup(e.target.value)}
															type="group" name="group" id="group" placeholder="Name of group"/>
														<Button_check setValue={setGroup_on} value={group_on} label={"Add role to some group"}/>
													</div>
												</div>
												<div style={{marginTop: "3vh", width: "25vw"}}>
													<Button_check setValue={setGlobal} value={global_} label={"Add global tag to this role"}/>
												</div>
												<div style={{ width: "45vw"}}>
													<button className={"button_delete"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick= {()=>{Delete()}}>Delete</button>
													<button className={"button_reset"} style= {{marginTop: "3vh", marginLeft:"6vw"}} onClick= {()=>{GetRole(role)}}>Reset</button>
													<button className={"button_submit"} style= {{marginTop: "3vh", marginLeft:"3vw"}} onClick={()=>{saveData()}}>Save role</button>
												</div>
											</div>

											</div>


										</div>
								</div>}


							</div>
							<div id = {actions[2]} style = {{visibility: "collapse", borderRadius: "3%", boxShadow: "-1.6vw 2.5vh 10px 1px var(--colorShadowBrownGray)", transform: 'rotateY(0deg)',  transformOrigin: "right ", top:"-120vh", opacity: "0", position: "relative", background: "var(--colorLightGray)", height: "60vh"}}>
								<div style={{borderRadius: "5vh", padding: "3vh 2vw", width: "100%", height: "100%"}}>
									<div style={{border: "3px solid var(--colorShadowBrownGray)", boxShadow: "-0.9vh 0.4vh 0.5vh 0.1vh var(--colorBrownGray)", width: "100%", height: "100%"}}>
										{ !(typeFile == "file" && task== "") ? (
										<Editor
											onChange={(value, event) => {setCode(value)}}
											theme="vs-dark"
											height="100%"
											width="100%"
											defaultLanguage="yaml" defaultValue="// some comment"
											value={code}  />
										) : (
											<div style={{marginTop: "6vh", fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"#8b8479",  width: "91%",  margin: "5vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
												Select some file, please
											</div>
										)}
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
