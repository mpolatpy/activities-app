import React, { useEffect, useState } from 'react';
import { Card, Loader, Tab } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ProfileEvent } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileEventCard from './ProfileEventCard';

interface Props {
    predicate: string;
    username: string;
}

const ProfileEventsTab = ({predicate, username}: Props) => {
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState<ProfileEvent[]>([]);

    useEffect(() => {
        setLoading(true);
        agent.Profiles
            .listProfileActivities(username, predicate)
            .then((activities) => setActivities(activities))
            .then(() => setLoading(false));
    },[username, predicate]);

    if(loading){
        return <Loader active={loading} inline='centered' />
    }

    return (
        <Tab.Pane 
            attached={false} 
            style={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around'
            }}
        >
            <Card.Group itemsPerRow={4}>
            {
                activities.map(activity => (
                    <ProfileEventCard key={activity.id} activity={activity}/>
                ))
            }
            </Card.Group>
        </Tab.Pane>
    )

};

export default ProfileEventsTab;