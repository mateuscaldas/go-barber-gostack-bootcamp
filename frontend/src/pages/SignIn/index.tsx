import React, { useRef, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast, ToastMessage } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [toast, setToast] = useState<ToastMessage>({} as ToastMessage);

  const { signIn } = useAuth();
  const { addToast, removeToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('É obrigatório preencher!')
            .email('Digite um e-mail válido!'),
          password: Yup.string().required('É obrigatório preencher!'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);

          formRef.current?.setErrors(validationErrors);

          return;
        }

        const errorToast: Omit<ToastMessage, 'id'> = {
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        };
        const toastAdded = addToast(errorToast);
        setToast(toastAdded);
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link
            to="/signup"
            onClick={() => {
              if (toast) {
                removeToast(toast.id);
              }
            }}
          >
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
