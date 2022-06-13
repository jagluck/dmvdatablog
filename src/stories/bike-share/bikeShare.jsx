import React from 'react';
import Movement from '../../stories/bike-share/bike-share-movement/index.jsx';
import Traffic from '../../stories/bike-share/bike-share-traffic/index.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default class BikeShare extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
         return (
            <div className="bike_share">
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
