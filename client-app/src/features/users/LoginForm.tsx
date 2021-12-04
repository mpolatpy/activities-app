import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextIput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';

const LoginForm = () => {
    const { userStore } = useStore();
    const { user } = userStore;

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore.login(values)
                    .catch(e => setErrors({ error: 'Invalid email or password' }))
            }
        >
            {
                ({ handleSubmit, isSubmitting, errors }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <Header as="h2" color="teal" content="Login to Reactivities" textAlign="center"/>
                        <MyTextIput name="email" placeholder="Email" />
                        <MyTextIput name="password" placeholder="Password" type="password" />
                        {
                            errors.error && (
                                <Label
                                    style={{ marginBottom: 10 }}
                                    basic
                                    color="red"
                                    content={errors.error}
                                />
                            )
                        }
                        <Button loading={isSubmitting} positive fluid content="Login" type="submit" />
                    </Form>
                )
            }
        </Formik>
    )
};

export default observer(LoginForm);