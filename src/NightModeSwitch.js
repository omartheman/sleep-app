import React, { Component } from "react";
import Switch from "react-switch";

class NightModeSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: this.props.nightMode };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }
  componentDidUpdate(){
    this.props.setNightMode(this.state.checked);
  }

  render() {
    return (
      <label style={{marginBottom: 0}}>
        <Switch 
          onChange={this.handleChange} 
          checked={this.state.checked} 
          onColor='#7b37ff'
          offColor='#6cbbff'
          checkedIcon={
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center'
              }}
            >
              🌙
            </div>
          }
          uncheckedIcon={
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center'
              }}
            >
              🌞
            </div>
          }
        />
      </label>
    );
  }
}

export default NightModeSwitch;