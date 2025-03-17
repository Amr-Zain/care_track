import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Image, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { setAuthedUserThunk } from '../features/authedUser';
import { SIGNUP } from '../constants/routes';
import { userTypeOptions } from '../api/api';

const Login = () => {
const { register, control, handleSubmit, formState: { errors } } = useForm();
const navigate = useNavigate();
const { error, isLoading, user } = useSelector((store) => store.authedUser);
const dispatch = useDispatch();

const onSubmit = async (data) => {
    dispatch(setAuthedUserThunk({ create: false, user: data }));
};

useEffect(() => {
    document.title = 'Login';
    if (user.userType) navigate('/' + user.userType);
}, [user, navigate]);


return (
    <Container>
    <Row className="justify-content-center align-items-center">
        <Col sm={0} md={6} lg={7} className="d-none d-md-block">
        <Image
            src="./images/signup_login.png"
            alt="Login illustration"
            fluid
            className="mt-4"
        />
        </Col>
        
        <Col sm={10} md={6} lg={5}  className="bg-light p-3">
        <div className="text-center mb-4">
            <Image
            src="./images/logo.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: '200px' }}
            />
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: '400px' }}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
            <Controller
                name="userType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                <Select
                    {...field}
                    options={userTypeOptions}
                    placeholder="User Type"
                    className="mb-3"
                />
                )}
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                type="email"
                placeholder="Email"
                className='bg-white'
                isInvalid={!!errors.email}
                {...register("email", {
                required: "Email is required",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                }
                })}
            />
            {errors.email && (
                <Form.Control.Feedback type="invalid">
                {errors.email.message}
                </Form.Control.Feedback>
            )}
            </Form.Group>

            <Form.Group className="mb-4">
            <Form.Control
                type="password"
                placeholder="Password"
                isInvalid={!!errors.password}
                className='bg-white'
                {...register("password", {
                required: "Password is required",
                minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                }
                })}
            />
            {errors.password && (
                <Form.Control.Feedback type="invalid">
                {errors.password.message}
                </Form.Control.Feedback>
            )}
            </Form.Group>

            <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={isLoading}
            >
            {isLoading ? 'Loading...' : 'Login'}
            </Button>

            <p className="text-center mb-0">
            Don't have an account?{' '}
            <Link to={'/' + SIGNUP}>Sign up</Link>
            </p>
        </Form>
        </Col>
    </Row>
    </Container>
);
};

export default Login;