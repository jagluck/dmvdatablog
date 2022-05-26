import React from 'react';
import PropTypes from 'prop-types';
import '../../css/story.css';
import Movement from '../../stories/bike-share-movement/index.jsx';
import Traffic from '../../stories/bike-share-traffic/index.jsx';


export default class Story extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        var tableDivStyle = {
          marginTop: '25px',
          border: '1px black solid',
          height: '100%',
          padding: '15px',
          marginTop: '25px',
        }
         return (
            <div className="story">
                {/* <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.12.0/css/jquery.dataTables.css"></link>
                <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.12.0/js/jquery.dataTables.js"></script> */}
                <div className="story__inner">
                    {/* <Movement></Movement> */}
                    <Traffic></Traffic>
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
