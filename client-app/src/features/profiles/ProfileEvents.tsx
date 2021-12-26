import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Header, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfileEventsTab from './ProfileEventsTab';

const predicates = ['isHosting', 'future', 'past'];

const ProfileEvents = () => {

    const { username } = useParams<{ username: string }>();

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={
                            predicates.map(predicate => ({
                                menuItem: predicate.toUpperCase(),
                                render: () => <ProfileEventsTab predicate={predicate} username={username} />
                            }))
                        }
                    />
                </Grid.Column>

            </Grid>
        </Tab.Pane>
    );
}

export default ProfileEvents;