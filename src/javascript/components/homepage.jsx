import React from 'react';
import StoryLink from './storyLink';
import PropTypes from 'prop-types';

import '../../css/homepage.css';

export default class Homepage extends React.Component{

    constructor(props) {
        super(props);
    }

    importAll(r) {
        return r.keys().map(r);
    }

    render() {   
        const stories = this.importAll(require.context('../../stories', true, /\.(json)$/));
        let storyLinks = [];
        for (const story in stories) {
           storyLinks.push(
                    <StoryLink 
                        buttonClick={this.props.changeButtonState}
                        storyId={stories[story]['storyId']}
                        title= {stories[story]['title']}
                        imageUrl = {stories[story]['imageUrl']}
                        teaser = {stories[story]['teaser']}
                    />
           )
        } 

        return (
            <div className="homepage">
                {storyLinks}
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
