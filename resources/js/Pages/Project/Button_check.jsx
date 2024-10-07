import React, {Component} from "react";
import '/resources/css/app.css';

export default class Button_check extends Component{
	constructor (props) {
		super(props);
		this.state = {
			vision: ["hidden","visible"],
			value: this.props.value,
			Change: (e) => {
				this.props.setValue(!this.state.value);
				this.setState({value: !this.state.value});
			}
		}
	}
	componentWillReceiveProps(new_props) {
		this.setState({value: new_props['value']})	
	}
	render() {
		return(
			<div>
				<div style= {{display:"flex", flexDirection: "inline"}}>
					<div className={"check_button check_"+ this.state.value + "" } id={"check_global"} onClick= {(e) => this.state.Change(e)}>
								<p id= {"check_global_label"} style={{visibility: this.state.vision[+this.state.value], userSelect: "none"}}>{'\u2713'}</p>
					</div>
					<p style= {{fontSize: "2vh", marginRight: "2vw"}}>{this.props.label}</p>
				</div>
			</div>
		);
	}
}