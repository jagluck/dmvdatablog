import React from 'react';
import logo from '../../resources/logo.svg';
import MainSection from './mainSection';

export default class MainSectionController extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            load: 'homepage',
            story: null,
        };
    }

    changeButtonState(load, story) {
        this.setState({
            load: load,
            story: story,
        });
    }

    render() {
        return (
            <div className="app">
            <div className="topnav" onClick={() =>  this.changeButtonState('homepage', null)}>
              <img src={logo} width="100" height="50" />
            </div>
            <div className='main'> 
              <div className='mainSection'> 
                <MainSection
                    changeButtonState={this.changeButtonState.bind(this)}
                    load={this.state.load}
                    story={this.state.story}
                />
              </div>
            </div>
          </div>
        )
    }
}

