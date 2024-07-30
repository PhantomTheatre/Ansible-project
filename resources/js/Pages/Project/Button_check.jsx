import React, {Component} from "react";
import '/resources/css/app.css';

export default class Button_check extends Component{
	constructor (props) {
		super(props);
		this.state = {
			vision: ["hidden","visible"],
			Change: (e) => {
				this.props.setValue(!this.props.value);
				e.currentTarget.classList.toggle("check_" + this.props.value);
				e.currentTarget.classList.remove("check_" + !this.props.value);
			}
		}
	}
	render() {
		return(
			<div>
				<div style= {{display:"flex", flexDirection: "inline", marginTop: "3vh"}}>
					<div className={"check_button check_"+ this.props.value+ ""} id={"check_global"} onClick= {(e) => this.state.Change(e)}>
								<p id= {"check_global_label"} style={{visibility: this.state.vision[+this.props.value], userSelect: "none"}}>{'\u2713'}</p>
					</div>
					<p style= {{fontSize: "2vh", marginRight: "2vw"}}>{this.props.label}</p>
				</div>
			</div>
		);
	}
}