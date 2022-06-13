import React from 'react';
import PropTypes from 'prop-types';
import '../../css/story.css';
import Movement from '../../stories/bike-share/bike-share-movement/index.jsx';
import Traffic from '../../stories/bike-share/bike-share-traffic/index.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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
                <Tabs className={"justify-content-center"}>
                    <TabList>
                        <Tab> Movement </Tab>
                        <Tab> Traffic </Tab>
                    </TabList>
                    <TabPanel>
                        <Movement></Movement>
                    </TabPanel>
                    <TabPanel>
                        <Traffic></Traffic>
                    </TabPanel>
                </Tabs>    
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
    componentName: PropTypes.string,
};
