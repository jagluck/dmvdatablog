import React from 'react';
import PropTypes from 'prop-types';

import '../../css/graphic.css';

export default class Graphic extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
         return (
            <div className="graphic">
               <iframe id={"graphic__inner"} className="graphic__inner" src="" ></iframe>
            </div>
        );
    }

    componentDidMount() {
            var url = this.props.url;
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {
                var iframe = document.getElementById("graphic__inner");
                iframe.src = 'data:text/html;base64,' + encodeURIComponent(data['content']);
            });
    }
}

Graphic.defaultProps = {
    url: '',
    name: ''
};

Graphic.propTypes = {
    url: PropTypes.string,  
    name: PropTypes.string,  
};
