import React from 'react';
import Homepage from './homepage';
import Story from './story';
import StoryLink from './storyLink';

import PropTypes from 'prop-types';

export default class MainSection extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.load === 'homepage') {
            return (
                <div className="main-section">
                    <Homepage
                     changeButtonState={this.props.changeButtonState}
                    />
                </div>
            );
        } else if (this.props.story !== null) {
            return (
                <div className="main-section">
                    <Story
                        title={'Story 1'}
                        body={'Story 1 body'}
                        buttonClick={this.props.changeButtonState}
                    />
                </div>
            )
        } else {
            console.log("B");

            return null 
        }
    }
}


MainSection.defaultProps = {
    load: 'homepage',
    story: null,
};

MainSection.propTypes = {
    load: PropTypes.string,
    story: PropTypes.string,
    changeButtonState: PropTypes.func,
};
