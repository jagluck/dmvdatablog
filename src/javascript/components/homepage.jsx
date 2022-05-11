import React from 'react';
import StoryLink from './storyLink';
import PropTypes from 'prop-types';

import '../../css/homepage.css';

export default class Homepage extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
         return (
            <div className="homepage">
                <StoryLink 
                    buttonClick={this.props.changeButtonState}
                    title= 'Story 1'
                    imageUrl = 'https://cnsmaryland.org/interactives/spring-2019/bitter-cold/images/climateedit2.png'
                    teaser = 'teaser'
                />
                <StoryLink
                    buttonClick={this.props.changeButtonState}
                    title= 'Story 2'
                    imageUrl = 'https://cnsmaryland.org/interactives/spring-2019/bitter-cold/images/climateedit2.png'
                    teaser = 'teaser'
                />
                <StoryLink
                    buttonClick={this.props.changeButtonState}
                    title= 'Story 3'
                    imageUrl = 'https://cnsmaryland.org/interactives/spring-2019/bitter-cold/images/climateedit2.png'
                    teaser = 'teaser'
                />
            </div>
        );
    }
}

Homepage.defaultProps = {
    load: 'homepage',
};

Homepage.propTypes = {
    load: PropTypes.string,
    changeButtonState: PropTypes.func,
};
