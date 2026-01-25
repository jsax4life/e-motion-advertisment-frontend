
import React, { useState, useContext } from "react";


import { FormInput, FormCheck, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import billboard from "../../assets/images/billboard.png";

import clsx from "clsx";

import Logo from "../../assets/images/emotion-logo.jpeg";
import Notification from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Backdrop } from "../../base-components/Headless";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../utils/API";
import { UserContext } from "../../stores/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toastify from "toastify-js";


export default function Main() {

  const { user, userDispatch } = useContext(UserContext);
  const location = useLocation();

  const [error, setError] = useState("");
  const history = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPasswd = () => setShowPassword(!showPassword);

  const [isLoading, setIsLoading] = useState(false);
  const from = ((location.state as any)?.from.pathname as string) || "/profile";

  // const [buttonClass, setButtonClass] = useState('inline');

  const schema = yup
    .object({
      email: yup.string().required().min(4),
      password: yup.string().required().min(4),
    })
    .required();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onBlur", resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    // console.log(data);
    setIsLoading(true);
    const result = await trigger();
    if (!result) {
      const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      // setIsLoading(false)
    }

    if (isLoading === true) return;
    setError("");
    setIsLoading(true);
    API("post", "login", data, onLogin, onFail, user?.data && user.data);
  };

  function onLogin(userData: any) {
    console.log(userData)

    setIsLoading(false);
    userDispatch({ type: "STORE_USER_DATA", user: userData });
    const successEl = document
      .querySelectorAll("#success-notification-content")[0]
      .cloneNode(true) as HTMLElement;

    successEl.classList.remove("hidden");
    Toastify({
      node: successEl,
      duration: 8000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
    history("/dashboard");
    console.log('logged in')
  }

  function onFail(error: any) {
    setError(error);
    setIsLoading(false);
    console.log(error);
    const failedEl = document
      .querySelectorAll("#failed-notification-content")[0]
      .cloneNode(true) as HTMLElement;
    failedEl.classList.remove("hidden");
    Toastify({
      node: failedEl,
      duration: 8000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
  }



  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="h-screen lg:overflow-hidden flex">
      <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={billboard}
            alt=""
          />
        </div>

        <div className="bg-white flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="">
              <img
                className="h-12 w-auto"
                src={Logo}
                alt="Workflow"
              />
              <h2 className="mt-14 text-3xl font-semibod text-gray-900">Welcome to <span className="font-bold text-customColor">E-motion</span></h2>
           
            </div>

          
  

              



              <form
                  className="validate-form  flex flex-col space-y-12 text-sm"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="mt-8 intro-x">
                  <FormLabel htmlFor="email" className="block  font-medium text-gray-700">
                      Enter your username or email address
                    </FormLabel>
                    <FormInput
                      type="text"
                      placeholder="Username or Email address"
                      {...register("email")}
                      id="validation-form-1"
                      name="email"
                      className={`${clsx({
                        "border-danger": errors.email,
                      })} block px-4 py-4 rounded-xl intro-x login__input min-w-full xl:min-w-[350px]`}

                      // className="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                      // placeholder="Full Name"
                    />
                    {errors.email && (
                      <div className="mt-2 text-danger">
                        {typeof errors.email.message === "string" &&
                          errors.email.message}
                      </div>
                    )}
                    </div>


                    <div className="relative">
                    <FormLabel htmlFor="password" className="block font-medium text-gray-700">
                      Enter your Password
                    </FormLabel>
                      <FormInput
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`${clsx({
                          "border-danger": errors.password,
                        })} block px-4 py-4 mt-4  login__input min-w-full xl:min-w-[350px]`}
                        placeholder="Password"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}

                      <div
                        className={`absolute ${!errors.password? 'bottom-3' : 'bottom-10'} right-0 pr-3 flex items-center cursor-pointer`}
                        onClick={toggleShowPasswd}
                      >
                        {showPassword ? (
                          <EyeSlashIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>


                  <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 ">
                    <div className="flex items-center mr-auto">
                      <FormCheck.Input
                        id="remember-me"
                        type="checkbox"
                        className="mr-2 border"
                      />
                      <label
                        className="cursor-pointer select-none"
                        htmlFor="remember-me"
                      >
                        Remember me
                      </label>
                    </div>
                    <p>
                      <Link to="/forgotpassword">forgot Password?</Link>
                    </p>
                  </div>
                  <div className="mt-5 text-center intro-x xl:mt-8 text-white lg:w-1/2 ">
                    <Button
                     
                      className="w-full px-4 py-4 align-top xl:mr-3 bg-customColor"
                    >
                    

{isLoading ?  "Signning in " : 'Sign in'}
{isLoading && (
                        <span className="ml-4">
                          <LoadingIcon icon="three-dots" color="#fff" />
                        </span>
                      )}
                      
                    </Button>
                    
                  </div>


                </form>




                <Notification
              id="success-notification-content"
              className=" hidden"
            >
              <Lucide icon="CheckCircle" className="text-success" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Login successful!</div>
                <div className="mt-1 text-slate-500">
                  It's good to have you back again
                </div>
              </div>
            </Notification>
            {/* END: Success Notification Content */}
            {/* BEGIN: Failed Notification Content */}
            <Notification
              id="failed-notification-content"
              className=" hidden"
            >
              <Lucide icon="XCircle" className="text-danger" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Login failed!</div>
                <div className="mt-1 text-slate-500">
                  Please check the fileld form.
                </div>
              </div>
            </Notification>



          </div>
        </div>
    
      </div>
    </>
  )
}


