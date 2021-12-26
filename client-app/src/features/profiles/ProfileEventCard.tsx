import React from 'react';
import { ProfileEvent } from '../../app/models/profile';
import { Card, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

interface Props {
    activity: ProfileEvent;
}

const ProfileEventCard = ({activity}: Props ) => (
  <Card as={Link} to={`/activities/${activity.id}`}>
    <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{activity.title}</Card.Header>
      <Card.Meta>
        <span className='date'>{activity.date}</span>
      </Card.Meta>
    </Card.Content>
  </Card>
)

export default ProfileEventCard;