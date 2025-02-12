import _ from "lodash";
import React, { useState, useContext } from "react";
import { RequiredError } from "../../../components/Errors";
import { InvalidError } from "../../../components/Errors";
import { UserContext } from "../../../stores/UserContext";

import Toastify from "toastify-js";
import {  useNavigate } from "react-router-dom";
import Button from "../../../base-components/Button";
import Notification from "../../../base-components/Notification";
import { FormInput, FormLabel, FormSelect } from "../../../base-components/Form";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Lucide from "../../../base-components/Lucide";
import { useForm } from "react-hook-form";
import API from "../../../utils/API";

const ChangePassword = () => {
  const { user, userDispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useNavigate();
  const formSchema = yup.object().shape({
    current_password: yup.string().required("Current password is required"),
    new_password: yup
      .string()
      .required("New password is required")
      .min(6, "Password must be at 6 characters long"),
    confirm_new_password: yup
      .string()
      .required("New password is required")
      .oneOf([yup.ref("new_password")], "Passwords does not match"),
  });

  //   const formOptions = { resolver: yupResolver(formSchema),  mode: "onChange" };

  const {
    reset,
    register,
    handleSubmit,
    trigger,

    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    // console.log(data);
    setError("");
    setIsLoading(true);
    const result = await trigger();
    // if (!result) {
    //   const failedEl = document
    //     .querySelectorAll("#failed-notification-content")[0]
    //     .cloneNode(true) as HTMLElement;
    //   failedEl.classList.remove("hidden");
    //   Toastify({
    //     node: failedEl,
    //     duration: 3000,
    //     newWindow: true,
    //     close: true,
    //     gravity: "top",
    //     position: "right",
    //     stopOnFocus: true,
    //   }).showToast();
    //   setIsLoading(false);
    // }

    if (isLoading === true) return;
    // setError("");
    setIsLoading(true);
    const response = API(
      "put",
      `updateAdminProfile`,
      { ...data },
      onSuccess,
      onError,
      user.token && user.token
    );
  };

  const onSuccess = (res: any) => {
    console.log(res)
    setIsLoading(false);
    const successEl = document
      .querySelectorAll("#success-notification-content")[0]
      .cloneNode(true) as HTMLElement;

    successEl.classList.remove("hidden");
    Toastify({
      node: successEl,
      duration: 4000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
    reset({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    // history("/login");
  };

  const onError = (error: any) => {
    setError(error);
    setIsLoading(false);
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
    console.log(error);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 ">
          {/* BEGIN: Change Password */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="intro-y lg:mt-5">
            

              <div className="flex flex-col intro-y gap-x-2 mb-4 border-b pb-4">
               <div className="flex items-center  intro-y gap-x-2">
               <Lucide icon="User" className="w-6 h-6 text-slate-500 " />
                <h2 className="mr-auto text-lg text-slate-500 font-medium">
                  User Information
                </h2>
               </div>
                {error && <InvalidError error={error} />}

              </div>

              <div className="py-5">
                <div>
                  <FormLabel htmlFor="current-Password">
                    Current Password
                  </FormLabel>
                  <FormInput
                    {...register("current_password", { required: true })}
                    type="password"
                    // name="currentPassword"
                    id="current-Password"
                  />
                  {errors.current_password?.type === "required" && (
                    <RequiredError>Current password is required</RequiredError>
                  )}
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <FormInput
                    {...register("new_password", { required: true })}
                    type="password"
                    // name="newPassword"
                    id="newPassword"
                  />
                  {errors.new_password?.type === "required" && (
                    <RequiredError>New password is required</RequiredError>
                  )}
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="change-password-form-3">
                    Confirm New Password
                  </FormLabel>
                  <FormInput
                    {...register("confirm_new_password", {
                      required: true,
                    })}
                    type="password"
                    // name="confirmPassword"
                    id="confirmPassword"
                  />
                  {errors.confirm_new_password?.type === "required" && (
                    <RequiredError>Confirm password is required</RequiredError>
                  )}
                  {errors.confirm_new_password?.type === "oneOf" && (
                    <RequiredError>
                      {errors.confirm_new_password?.message}
                    </RequiredError>
                  )}
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-4 bg-customColor"
                  disabled={isLoading || !isDirty || !isValid}
                >
                  {isLoading ? (
                    <LoadingIcon icon="oval" color="blue" className="mr-4 " />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* END: Change Password */}
        </div>
      </div>

      <Notification id="success-notification-content" className=" hidden ">
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Updated Succesfully!</div>
          <div className="mt-1 text-slate-500">
            Please check your e-mail for further info!
          </div>
        </div>
      </Notification>
      {/* END: Success Notification Content */}
      {/* BEGIN: Failed Notification Content */}
      <Notification id="failed-notification-content" className="hidden">
        <Lucide icon="XCircle" className="text-danger" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Error! can't Update Password</div>
          <div className="mt-1 text-slate-500">
            Please check the fileld form.
          </div>
        </div>
      </Notification>
    </>
  );
};

export default ChangePassword;
