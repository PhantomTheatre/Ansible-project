import React, {Component} from "react";

export default class Button extends Component{
	constructor (props) {
		super(props);
		this.state = {
			size : "4vh",
			left : "8vh",
			button_Hover: () => {
				clearInterval(this.state.button_unflow);
				if (parseFloat(this.state.size)< 5.25) {
					let button_flow = setInterval(() => {
						this.setState({size : (parseFloat(this.state.size) + 0.25) + "vh"});
						this.setState({left : (parseFloat(this.state.left) - 0.4) + "vh"});
						if (parseFloat(this.state.size) >= 5) {
							clearInterval(this.state.button_flow);
							this.setState({size : "5vh",});
							this.setState({left : "6.4vh",});
						}
					}, 10);
					this.setState({button_flow});
				}
			},
			button_unHover: () => {
				clearInterval(this.state.button_flow);
				if (parseFloat(this.state.size)> 3.75) {
					let button_unflow = setInterval(() => {
						this.setState({size : (parseFloat(this.state.size) - 0.25) + "vh"});
						this.setState({left : (parseFloat(this.state.left) + 0.4) + "vh"});
						if (parseFloat(this.state.size)<= 4) {
							clearInterval(this.state.button_unflow);
							this.setState({size : "4vh",});
							this.setState({left : "8vh",});
						}
					}, 10);
					this.setState({button_unflow});
				}
			},
		}
	}
	componentWillUpdate() { 
	}
	render() {
		return(
			<div>
				<div onMouseEnter= {() => this.state.button_Hover()} onMouseLeave={()=>this.state.button_unHover()} style={{ display: "grid", gridTemplateRow: "1", gridTemplateColumns: ('1vw ' + this.props.width +' 1vw')}}>
					<p style={{position: "relative", left: "-0.5vh"}}>/</p> 
					<div>
							{this.props.type == this.props.subject ? (
								<div style = {{ display: "flex", alignItems: "center", flexDirection: "column"}}>
									<div style = {{  borderRadius: "10%", borderTop:"solid", background:"yellow", width: this.props.width , height: "6vh", position: "relative", left: "-0.5vh",top: "1vh", transform: 'skew(-18deg, 0deg)',}}></div>
									<label id = {"a"} style = {{marginTop:"0.4vh", position: "relative",   left: "-0.5vh", top:"-6vh", fontSize: (parseFloat(this.state.size)+0.5 + "vh"),}} onClick={() => this.props.setType(this.props.subject)}><u>{this.props.subject}</u></label>
								</div>
							) : (
								<div style = {{display: "flex", alignItems: "center", flexDirection: "column"}}>
									<label id = {"a"} style = {{position: "relative",   left: "-0.5vh", fontSize: this.state.size,}} onClick={() => this.props.setType(this.props.subject)}><p>{this.props.subject}</p></label>
								</div>
							)}
					</div>
					{(this.props.end != false) ?
					(<p style={{position: "relative", left: "0.5vh"}}>/</p>) : ( <p></p> )}
				</div>
			</div>
		);
	}
}