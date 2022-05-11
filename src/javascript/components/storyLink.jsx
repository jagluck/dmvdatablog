import React from 'react';
import PropTypes from 'prop-types';

import '../../css/storyLink.css';

export default class StoryLink extends React.Component{
    constructor(props) {
        super(props);
    }


    render() {
         return (
            <div className="storyLink" onClick={() =>  this.props.buttonClick('story', this.props.title)}>
              <h1 className="storyLink__title">{this.props.title}</h1>
              <img className="storyLink__image" src={this.props.imageUrl} />
              <p className="storyLink__teaser">{this.props.teaser}</p>
            </div>
        );
    }
}

StoryLink.defaultProps = {
    title: '',
    imageUrl : '',
    teaser : '',
};

StoryLink.propTypes = {
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    teaser: PropTypes.string,
    buttonClick: PropTypes.func,
};
