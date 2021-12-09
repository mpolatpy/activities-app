import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextIput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';
import { error } from 'console';

const RegisterForm = () => {
    const { userStore } = useStore();
    const { user } = userStore;

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore.register(values)
                    .catch(e => setErrors({ error: e }))
            }
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required()
            })}
        >
            {
                ({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                    <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                        <Header as="h2" color="teal" content="Sign up to Reactivities" textAlign="center" />
                        <MyTextIput name="displayName" placeholder="Display Name" />
                        <MyTextIput name="username" placeholder="Username" />
                        <MyTextIput name="email" placeholder="Email" />
                        <MyTextIput name="password" placeholder="Password" type="password" />
                        {
                            errors.error && (
                                // <Label
                                //     style={{ marginBottom: 10 }}
                                //     basic
                                //     color="red"
                                //     content={errors.error}
                                // />
                                <ValidationErrors errors={errors.error} />
                            )
                        }
                        <Button
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting}
                            positive fluid
                            content="Register"
                            type="submit"
                        />
                    </Form>
                )
            }
        </Formik>
    )
};

export default observer(RegisterForm);