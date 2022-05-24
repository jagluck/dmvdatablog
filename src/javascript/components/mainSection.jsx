import React from 'react';
import Homepage from './homepage';
import Story from './story';

import PropTypes from 'prop-types';

export default class MainSection extends React.Component{
    constructor(props) {
        super(props);
    }


    importAll(r) {
        return r.keys().map(r);
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
            const stories = this.importAll(require.context('../../stories', false, /\.(json)$/));
            for (const story in stories) {
                if (this.props.story === stories[story]['storyId']) {
                    return (
                        <div className="main-section">
                            <Story
                                title={stories[story]['title']}
                                body={stories[story]['body']}
                                buttonClick={this.props.changeButtonState}
                            />
                        </div>
                    )
                }
            }
            return null;
        } else {
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
