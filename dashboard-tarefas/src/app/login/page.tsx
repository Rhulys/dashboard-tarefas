"use client";
import React, { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const REGISTER_USER = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            id
            name
            email
            token
        }
    }
`;

const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            name
            email
            token
        }
    }
`;

export default function LoginPage() {
    const { login } = useContext(AuthContext)!;
    const router = useRouter();
    const [isRegistering, setIsRegisteing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [register] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            login(data.register.token, {
                id: data.register.id,
                name: data.register.name,
                email: data.register.email,
            });
            router.push("/");
        },
        onError: (err) => alert(err.message),
    });

    const [loginUser] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            login(data.login.token, {
                id: data.login.id,
                name: data.login.name,
                email: data.login.email,
            });
            router.push("/");
        },
        onError: (err) => alert(err.message),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isRegistering) {
            register({ variables: formData });
        } else {
            loginUser({
                variables: {
                    email: formData.email,
                    password: formData.password,
                },
            });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {isRegistering ? "Criar Conta" : "Entrar"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <input
                            type="text"
                            placeholder="Nome"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        {isRegistering ? "Criar Conta" : "Entrar"}
                    </button>
                </form>
                <p
                    className="text-center text-blue-600 cursor-pointer mt-2"
                    onClick={() => setIsRegisteing(!isRegistering)}
                >
                    {isRegistering
                        ? "Já tem uma conta? Entrar"
                        : "Não tem uma conta? Criar uma"}
                </p>
            </div>
        </div>
    );
}
