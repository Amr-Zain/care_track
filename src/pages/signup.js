import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Image, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { setAuthedUserThunk } from '../features/authedUser';
import { LOGIN, DOCTOR } from '../constants/routes';
import { getCitiesAndSpecializations } from '../features/cities-specializations';

const SignUp = () => {
  const { 
    register, 
    control, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      userType: { label: 'Patient', value: 'patient' }
    }
  });
  
  const navigate = useNavigate();
  const { error, isLoading, user } = useSelector((store) => store.authedUser);
  const { cities, specializations } = useSelector((store) => store.citiesAndSpecializations);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    dispatch(setAuthedUserThunk({ 
      create: true, 
      user: data 
    }));
  };

  useEffect(() => {
    document.title = 'Sign Up';
    if (user.userType) navigate('/' + user.userType);
    if (cities.length === 0 || specializations.length === 0) {
      dispatch(getCitiesAndSpecializations());
    }
  }, [user, navigate, dispatch, cities, specializations]);

  const userTypeOptions = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
  ];

  return (
    <Container  className="min-vh-100 d-flex align-items-center">
      <Row className="g-0 justify-content-center w-100">
        <Col md={6} className="d-none d-md-flex align-items-center">
          <Image
            src="/images/signup_login.png"
            alt="Signup illustration"
            fluid
            className="h-70 w-100 object-fit-cover"
          />
        </Col>
        
        <Col sm={12} md={6} lg={5} className="p-5">
          <div className="text-center mb-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fluid
              style={{ maxWidth: '200px' }}
            />
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Form.Group className="mb-3">
              <Controller
                name="userType"
                control={control}
                rules={{ required: "User Type is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      {...field}
                      options={userTypeOptions}
                      placeholder="Select User Type"
                      classNamePrefix="react-select"
                      className={error ? 'is-invalid' : ''}
                    />
                    {error && (
                      <Form.Text className="text-danger">{error.message}</Form.Text>
                    )}
                  </>
                )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Full Name"
                className='bg-white'
                isInvalid={!!errors.name}
                {...register('name', {
                  required: 'Full name is required',
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                    message: 'Enter at least two names'
                  }
                })}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                className='bg-white'
                placeholder="Email Address"
                isInvalid={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                className='bg-white'
                placeholder="Phone Number (01XXXXXXXXX)"
                isInvalid={!!errors.phone}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: 'Invalid Egyptian phone number'
                  }
                })}
              />
              {errors.phone && (
                <Form.Control.Feedback type="invalid">
                  {errors.phone.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                className='bg-white'
                isInvalid={!!errors.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum 8 characters required'
                  }
                })}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      {...field}
                      options={cities}
                      placeholder="Select City"
                      classNamePrefix="react-select"
                      className={error ? 'is-invalid' : ''}
                    />
                    {error && (
                      <Form.Text className="text-danger">{error.message}</Form.Text>
                    )}
                  </>
                )}
              />
            </Form.Group>

            {watch('userType')?.value === DOCTOR && (
              <Form.Group className="mb-3">
                <Controller
                  name="specialization"
                  control={control}
                  rules={{ required: "Specialization is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        options={specializations}
                        placeholder="Select Specialization"
                        classNamePrefix="react-select"
                        className={error ? 'is-invalid' : ''}
                      />
                      {error && (
                        <Form.Text className="text-danger">{error.message}</Form.Text>
                      )}
                    </>
                  )}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Control
                type="date"
                isInvalid={!!errors.birthDay}
                className='bg-white'
                {...register('birthDay', {
                  required: 'Birth date is required'
                })}
              />
              {errors.birthDay && (
                <Form.Control.Feedback type="invalid">
                  {errors.birthDay.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className="text-center mb-0">
              Already have an account?{' '}
              <Link to={'/' + LOGIN}>Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;