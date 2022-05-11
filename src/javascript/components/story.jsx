import React from 'react';
import PropTypes from 'prop-types';
import Graphic from './graphic';

import '../../css/story.css';

export default class Story extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
         return (
            <div className="story" onClick={() =>  this.props.buttonClick(this.props.title)}>
                <div className="story__inner">
                    <p className="story__title">{this.props.title}</p>
                    <hr></hr>
                    <p className="story__body">
                        {this.props.body}
                        <Graphic
                        url={"https://api.github.com/repos/jagluck/dc-bike-analysis/contents/graphics/bike-share-movement/index.html"}
                        name={"movement"}
                        />
                    </p>
                </div>
            </div>
        );
    }
}

Story.defaultProps = {
    title: '',
    body: ''
};

Story.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string,
    changeButtonState: PropTypes.func,
};
