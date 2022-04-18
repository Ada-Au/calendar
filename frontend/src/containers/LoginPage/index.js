import React, { useState } from 'react';
import {
  Paper,
  Button,
  Typography,
  TextField,
  Link,
  styled,
} from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

import PasswordField from '../../components/PasswordField';
import {
  errorNotification,
  successNotification,
} from '../../components/Notification';

const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGN_UP = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      id
    }
  }
`;

const Label = styled(Typography)(() => ({
  padding: '16px 0px 8px 0px',
}));

const Background = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage:
    "url('https://images.unsplash.com/photo-1435527173128-983b87201f4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1767&q=80')",
}));

const Wrapper = styled(Paper)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: '64px',
  width: '450px',
}));

const LinkBtn = styled(Link)(() => ({
  cursor: 'pointer',
  paddingLeft: '4px',
}));

function LoginPage() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['token']);

  const [isLogin, setIsLogin] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [confirmPwError, setConfirmPwError] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPw: '',
  });

  const [login, { loading: loginLoading }] = useMutation(LOGIN, {
    onError: (error) => {
      let { message } = error;
      if (message.includes('No user found for email')) {
        setEmailError(true);
      } else if (message.includes('Invalid Password')) {
        setPwError(true);
      }
      errorNotification(message);
    },
    onCompleted: (data) => {
      if (data?.login) {
        const { token } = data.login;
        setCookie('token', token, {
          path: '/',
          maxAge: 60 * 60 * 24, // Will expire after 1 day
        });
        navigate('/home');
      }
    },
  });

  const [signUp, { loading: signUpLoading }] = useMutation(SIGN_UP, {
    onError: (error) => {
      let { message } = error;
      console.log(error);
      if (message.includes('registered with another account')) {
        setEmailError(true);
      } else if (message.includes('Invalid Password')) {
        setPwError(true);
      }
      errorNotification(message);
    },
    onCompleted: (data) => {
      successNotification('Account created!');
      setIsLogin(true);
    },
  });

  const handleChange = (prop) => (event) => {
    if (prop === 'email' && emailError) {
      setEmailError(false);
    }
    if (prop === 'password' && pwError) {
      setPwError(false);
    }
    if (prop === 'confirmPw' && confirmPwError) {
      setConfirmPwError(false);
    }
    if (prop === 'name' && nameError) {
      setNameError(false);
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleLogin = () => {
    const { email, password } = values;
    if (!email) {
      setEmailError(true);
      errorNotification('No email is set');
    } else if (!emailRegex.test(email)) {
      setEmailError(true);
      errorNotification('Email format not correct');
    } else if (!password) {
      setPwError(true);
      errorNotification('No password is set');
    } else {
      login({ variables: { email, password } });
    }
  };

  const handleSignUp = () => {
    const { name, email, password, confirmPw } = values;
    if (!name) {
      setNameError(true);
      errorNotification('No name is set');
    } else if (!email) {
      setEmailError(true);
      errorNotification('No email is set');
    } else if (!emailRegex.test(email)) {
      setEmailError(true);
      errorNotification('Email format not correct');
    } else if (!password) {
      setPwError(true);
      errorNotification('No password is set');
    } else if (password !== confirmPw) {
      setConfirmPwError(true);
      errorNotification('Confirm password does not match');
    } else {
      hashPassword(password).then((hashedPassword) => {
        signUp({ variables: { name, email, password: hashedPassword } });
      });
    }
  };

  async function hashPassword(password) {
    return password && (await bcrypt.hash(password, 10));
  }

  const ChangePage = () => {
    setIsLogin((prev) => !prev);
    setNameError(false);
    setEmailError(false);
    setPwError(false);
    setConfirmPwError(false);
  };

  return (
    <Background>
      {isLogin ? (
        <Wrapper elevation={3}>
          <Typography variant="h4">Login</Typography>

          <Typography variant="caption" sx={{ textAlign: 'right' }}>
            Don't have an account?
            <LinkBtn onClick={ChangePage}>Sign up</LinkBtn>
          </Typography>

          <Label variant="body2">Email</Label>
          <TextField
            size="small"
            variant="outlined"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            error={emailError}
          />

          <Label variant="body2">Password</Label>
          <PasswordField onChange={handleChange('password')} error={pwError} />

          <Button
            variant="contained"
            sx={{ marginTop: '48px' }}
            onClick={handleLogin}
            // disabled={loading}
          >
            Login
          </Button>
        </Wrapper>
      ) : (
        <Wrapper elevation={3}>
          <Typography variant="h4">Sign Up</Typography>

          <Typography variant="caption" sx={{ textAlign: 'right' }}>
            Already have an account?
            <LinkBtn onClick={ChangePage}>Login</LinkBtn>
          </Typography>

          <Label variant="body2">Name</Label>
          <TextField
            size="small"
            variant="outlined"
            value={values.name}
            onChange={handleChange('name')}
            error={nameError}
            required
          />

          <Label variant="body2">Email</Label>
          <TextField
            size="small"
            variant="outlined"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            error={emailError}
            required
          />

          <Label variant="body2">Password</Label>
          <PasswordField onChange={handleChange('password')} error={pwError} />

          <Label variant="body2">Confirm Password</Label>
          <PasswordField
            onChange={handleChange('confirmPw')}
            error={confirmPwError}
          />

          <Button
            variant="contained"
            sx={{ marginTop: '48px' }}
            onClick={handleSignUp}
            //   disabled={loading}
          >
            Sign Up
          </Button>
        </Wrapper>
      )}
    </Background>
  );
}

export default LoginPage;
