import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextIput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectIput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { Activity } from '../../../app/models/activity';

export default observer(function ActivityForm() {
    const history = useHistory();
    const {activityStore} = useStore();
    const {createActivity, updateActivity, 
            loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity]);

    const validationSchema = Yup.object({
        title: Yup.string().required('This is a required field'),
        description: Yup.string().required(),
        date: Yup.string().required('Date is a required field'),
        city: Yup.string().required(),
        venue: Yup.string().required(),
        category: Yup.string().required()
    });

    function handleFormSubmit(activity: Activity) {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content="Activity Details" color="teal"/>
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize 
            initialValues={activity} 
            onSubmit={activity => handleFormSubmit(activity)}
            >
                {({handleSubmit, isSubmitting, isValid, dirty}) => (
                    <Form onSubmit={handleSubmit} className="ui form" autoComplete='off'>
                        <MyTextIput name="title" placeholder="Title" />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectIput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput 
                        placeholderText='Date' 
                        name='date' 
                        showTimeSelect
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextIput placeholder='City' name='city' />
                        <MyTextIput placeholder='Venue' name='venue' />
                        <Button 
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={loading} 
                            floated='right' 
                            positive type='submit' 
                            content='Submit' 
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})