import React, {Component} from "react";

export default class Button extends Component{
	constructor (props) {
		super(props);
		this.state = {
			search : "",
			
			filtered_objects : [...Object.values(this.props.objects)],
			shadow : Object.values(this.props.objects).length>7 ? "visible" : "collapse",
			mouse : "up",
			lazerTop : '0px',
			shadowTopOpacity : 0,
			shadowBottomOpacity : Object.values(this.props.objects).length>7 ? 1 : 0,
			SelectMenuTop : "0vh",
			min : 225,
			max : 177,
			size_of_block: 0.039,
			
			MouseMove : () => {
				let fraction = ((event.pageY-(window.innerHeight*(225/524))) / (window.innerHeight*(177/524)) * 100); // Проценты
				if (this.state.mouse == "down" && fraction<= 3) {
					this.setState({lazerTop: (5+ 'px')});
				}
				else if (this.state.mouse == "down" && fraction>= 97) {
					this.setState({lazerTop: window.innerHeight*((this.state.max -2)/524)+ 'px'}); 
				}
				else if (this.state.mouse == "down")  {
					this.setState({lazerTop: (event.pageY-(window.innerHeight*((this.state.min+2)/524)))+ 'px'});
					this.setState({ shadowTopOpacity :fraction/100*3});
					this.setState({ shadowBottomOpacity : 1-(fraction/100*4)});
					this.setState({ SelectMenuTop : (-((fraction-5)/90*100) *this.state.filtered_objects.length * window.innerHeight*this.state.size_of_block/100) + "px" });
				}
			},
			
			
			SearchChange: (e) => {
				this.setState({search : e.target.value})
				if (e.target.value == "") { this.setState({filtered_objects: [...Object.values(this.props.objects)]}) }
				else {
					let new_filter = [];
					[...Object.values(this.props.objects)].forEach((el) => {
						if (el['name'].toLowerCase().includes(e.target.value.toLowerCase())) { new_filter.push(el)}
					});
					this.setState({filtered_objects: [...new_filter]});
				}
			},
			
			
		}
	}
	componentDidMount() { 
		console.log(this.state.shadow);
	}
	componentWillUpdate() { 
	}
	componentWillReceiveProps(new_props) {
		this.setState({filtered_objects: [...Object.values(this.props.objects)]})	
	}
	render() {
		return(
			<div style= {{paddingLeft: "2vw", paddingTop: "3vh", position: "absolute", width: "96.5%", }} >
					
					
					<div style= {{display: "grid", gridTemplateRow: "1", gridTemplateColumns: ('37vw 15vw')}}>
						<p style= {{fontSize: "3vh"}}>{this.props.name_of_table}:</p>
						<div style={{display:"inline-flex", flexDirection: "row-reverse", alignItems: "center"}}>
							<input 
								className={"text_field"}
								style= {{marginLeft: "1.5vw", width: "18vw"}}
								value={this.state.search} 
								onChange={(e)=>{this.state.SearchChange(e)}}
								type="search" name="search" id="search" placeholder="Search"/>
							<p style= {{fontSize: "2.5vh", marginLeft: "1vw", marginTop:"0vh"}}>Search:</p>
						</div>
					</div>
					
					
					<div style={{marginTop: "1.5vh", overflow: "hidden", display: "inline-flex", background:"transparent",  width: "100%", height: "45vh",padding: "2vh 0vw", border: "2px solid var(--colorShadowBrownGray)", boxShadow: "inset 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
						<div className={"shadow_top"} style={{ pointerEvents: "none", zIndex: "5", opacity: this.state.shadowTopOpacity, position: "absolute", marginLeft: "1.4vw", marginTop: "-2vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(var(--colorBrownGray) 6%,  transparent 70%)", width: "47vw", height: "4vh"}}></div>
						<div className={"shadow_bottom"} style={{ pointerEvents: "none", visibility: this.state.shadow, zIndex: "5", opacity: this.state.shadowBottomOpacity, position: "absolute",  marginLeft: "1.4vw", marginTop: "38.4vh", display: "flex", dlexDirection: "reverse-collumn", background: "linear-gradient(transparent 30%,  var(--colorBrownGray) 95%)", width: "47vw", height: "4vh"}}></div>
						<div  className = {"SelectMenu"} style={{ position: "relative", top: this.state.SelectMenuTop, width: "100%", height: "41vh"}}>	
							
							{this.state.filtered_objects.map((el) => (
								<div className={"item"} onClick = {() =>{this.props.select_function(el)}} style={{fontSize: "1.8vh", display: "grid", gridTemplateColumns: this.props.grid_columns, margin: "0.5vh 1.5vw", padding: "0.8vh", width: "47vw", alignItems: "center"}} key={el['id']} value={el}>
									<div>{this.state.filtered_objects.indexOf(el)+1}</div>
									{this.props.cats.map((cat) => (
										<div key={cat +el['id']}>{cat!='global' ? (
											<p>{cat}: {el[cat]}</p>
										) : (
											<div key={cat +el['id']}>   {el['global' ]!='0' && <p>{'\u2713'}Global</p>}</div>
										)}
										</div>
									))}
								</div>
							))}
							{this.state.filtered_objects.length == 0 &&
								<div style={{fontSize: "2.5vh", display: "flex", justifyContent: "center", alignItems: "center", background:"var(--colorInfo)",  width: "91%",  margin: "1vh 2.3vw", height: "15vh", border: "2px solid var(--colorShadowBrownGray)", boxShadow: " 0vh 0vh 0.5vh 0.4vh var(--colorBrownGray)"}}>
									<p>{this.props.empty_label}</p>
								</div>
							}
						</div>
						{this.state.filtered_objects.length != 0 &&
								<div onMouseMove= {() => {this.state.MouseMove()}} onMouseLeave=  {() => {this.setState({mouse: "up"})}} className={"lazer" } style={{height: "40vh", width: "8%",  display: "flex", flexDirection: "row-reverse", overflow: "hidden", marginLeft: "0vw", }}>
									<div style={{border: "2px solid var(--colorShadowBrownGray)", background: "var(--colorInfo)", height: "40vh", width: "1.5vw",position: "relative", }} >
										<div 
											onMouseDown= {() => {this.setState({mouse: "down"})}}
											onMouseUp= {() => {this.setState({mouse: "up"})}}
											onDragStart= {() => {return false;}}
											id={"lazer_child"}
											style={{position: "absolute", top:this.state.lazerTop, boxShadow: "-0.1vh 0.1vh 0.1vh 0vh var(--colorBrownGray)", border: "2px solid var(--colorShadowBrownGray)", background: "white",  width: "100%", height: "5vh", position: "relative"}}>
											
											<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "30%"}}></div>
											<div style={{ background: "var(--colorShadowBrownGray)", height: "3px", width: "100%", position: "relative", top: "50%"}}></div>
										</div>
									</div>
								</div>
							}
						
					</div>
												
												
												
					
			</div>	
		);
	}
}