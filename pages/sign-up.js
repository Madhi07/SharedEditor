import AuthLayout from "@/components/AuthLayout";
import { ssoProviders } from "@/components/AuthLayout/constants";
import { isEmailExistsApiPath, signUpApiPath } from "@/constants/apiPaths";
import { seoData } from "@/constants/seoData";
import { useAuthContext } from "@/context/useAuthContext";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FaArrowRight, FaBuilding, FaCheckCircle, FaChevronCircleLeft, FaEnvelope, FaExclamationCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaFlag, FaLock, FaUser } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { emailRegex } from "@/constants";
import clsx from "clsx";
import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { useIpContext } from "@/context/useIpContext";
import { getSession, signIn } from "next-auth/react";


export default function signUpPage() {
  const { loginUser, loading, updateLoginUser } = useAuthContext();
  const { ipConfigData } = useIpContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: ""
  })
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formMessages, setFormMessages] = useState({
    email: {
      status: null,
      message: null
    }
  });
  const [resMessages, setResMessages] = useState({
    status: null,
    message: null
  });

  useEffect(() => {
    if (loading) return;

    if (loginUser && loginUser?.token) {
      router.push((!loginUser?.user_plan || loginUser?.user_plan === "free") ? "/dashboard/settings?tab=billing" : "/dashboard/agents/chats");
      return;
    }
  }, [loading])

  const signUp = async (event) => {
    event.preventDefault();
    // const formData = new FormData(event.target);

    setResMessages(prev => ({
      ...prev,
      status: "loading",
      message: null
    }))

    const parsed = parsePhoneNumber(formData.phone)
    const payload = {
      ...formData,
      country_code: parsed.countryCallingCode.includes("+") ? parsed.countryCallingCode : `+${parsed.countryCallingCode}`,
      phone: parsed.nationalNumber,
      type: "sign-up"
    };


    const res = await signIn('credentials', { redirect: false, ...payload });
    if (res?.status === 200) {
      setResMessages(prev => ({
        ...prev,
        status: null,
        message: null
      }));
      const session = await getSession();
      updateLoginUser(session?.user);

      if (!session?.user?.country || !session?.user?.company_profile_id) {
        router.push("/");
      }
      else {
        if (!session?.user?.user_plan || session?.user?.user_plan === "free") {
          router.push("/dashboard/settings?tab=billing");
        }
        else {
          router.push("/dashboard/agents/chats");
        }
      }

      return true;
    }

    if (res?.status >= 400 && res?.status < 500) {
      const error = JSON.parse(res?.error);
      if (error?.status >= 500) {
        setResMessages(prev => ({
          ...prev,
          status: "err5xx",
          message: "Server error occurred. Please try signing up again shortly."
        }));
        return false;
      }
      setResMessages(prev => ({
        ...prev,
        status: "err4xx",
        message: error?.message || "Something went wrong with your request. Please check and try again."
      }));
      return false;
    }

    if (res?.status >= 500) {
      setResMessages(prev => ({
        ...prev,
        status: "err5xx",
        message: "Server error occurred. Please try signing up again shortly."
      }));
      return false;
    }

  }


  const onResponseTryAgainClick = () => {
    setResMessages(prev => ({
      ...prev,
      status: null,
      message: null
    }));
  };

  const onPhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));

  }

  const handleEmailChange = async (event) => {

    // const hasFieldMsg = Object.values(formData.email).some(val => val);
    // if (hasFieldMsg) {
    //   setFormMessages(prev => ({
    //     ...prev,
    //     email: {
    //       ...prev.email,
    //       status: null,
    //       message: null
    //     }
    //   }));
    // }

    setFormData(prev => ({
      ...prev,
      email: event.target.value
    }));

    // if (!emailRegex.test(event.target.value)) return;

    // const result = await getIsEmailExists(event.target.value);
  }

  const getIsEmailExists = async (email = null) => {
    if (!email) return;

    setFormMessages(prev => ({
      ...prev,
      email: {
        ...prev.email,
        status: "loading",
        message: null
      }
    }));
    const res = await retrieveOrRemove("GET", `${isEmailExistsApiPath}?email=${email}`, false);
    let resData = null;
    try {
      resData = await res?.json();
    }
    catch (e) { }

    if (res?.status >= 400 && res?.status < 500) {
      setFormMessages(prev => ({
        ...prev,
        email: {
          ...prev.email,
          status: "err4xx",
          message: resData?.message || "Invalid request. Please check your input and try again."
        }
      }));
      return false;
    }
    if (res?.status >= 500) {
      setFormMessages(prev => ({
        ...prev,
        email: {
          ...prev.email,
          status: "err5xx",
          message: resData?.message || "Server error. Please try again later."
        }
      }));
      return false;
    }

    if (res?.status === 200) {
      setFormMessages(prev => ({
        ...prev,
        email: {
          ...prev.email,
          status: "ok",
          message: null
        }
      }));
      return true;
    }
  }


  if (loading) return;

  return (
    <Fragment>
      <NextSeo {...seoData.signUpPage} />
      <AuthLayout>
        {(loginUser && loginUser?.token) ? (
          <div className="h-full flex flex-col items-center justify-center transition-all duration-300">
            <FaCheckCircle className="mb-4 size-10 text-green-500" />

            <p className="from-primary to-secondary bg-clip-text bg-gradient-to-r text-transparent font-medium text-lg text-center">
              Login successful! Redirecting…
            </p>
          </div>
        ) : (
          <Fragment>
            {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || resMessages?.status === "ok") ? (
              <div className="flex items-center justify-center flex-col h-full w-full gap-4">
                {resMessages?.status === "err4xx" && (
                  <FaCircleXmark className="text-red-400 size-8" />
                )}

                {resMessages?.status === "err5xx" && (
                  <FaExclamationTriangle className="text-orange-400 size-8" />
                )}

                {resMessages?.status === "ok" && (
                  <FaCheckCircle className="text-green-400 size-8" />
                )}

                {resMessages?.message && (
                  <p className="text-lg font-[500] text-center ">
                    {resMessages?.message}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  {resMessages?.status === "ok" ? (
                    <Link
                      href={"/login"}
                      className="rounded-full font-[500] py-1 px-2.5 inline-flex items-center justify-center from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90"
                    >
                      <MdLogin className="mr-2" />
                      Login
                    </Link>
                  ) : (
                    <button
                      onClick={() => onResponseTryAgainClick()}
                      type="button"
                      className="rounded-full font-[500] py-1 px-2.5 inline-flex items-center justify-center from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}

                </div>

              </div>
            ) : (
              <Fragment>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Create Account</h2>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={signUp}
                >
                  <div id="name-fields" className="grid grid-cols-2 gap-4">
                    <div id="first-name-field" className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium text-gray-300">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className=" text-gray-500" />
                        </div>
                        <input
                          onChange={(event) => setFormData(prev => ({ ...prev, first_name: event.target.value }))}
                          value={formData.first_name}
                          pattern=".*\S.*"
                          type="text"
                          id="first-name"
                          name="first-name"
                          className="block w-full pl-10 pr-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>

                    <div id="last-name-field" className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium text-gray-300">Last Name</label>
                      <input
                        onChange={(event) => setFormData(prev => ({ ...prev, last_name: event.target.value }))}
                        value={formData.last_name}
                        pattern=".*\S.*"
                        type="text"
                        id="last-name"
                        name="last-name"
                        className="block w-full px-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-300"
                    >
                      Phone Number
                    </label>
                    <PhoneInput
                      defaultCountry={ipConfigData?.country || "IN"}
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={onPhoneChange}
                      countrySelectProps={{
                        className: "bg-dark-card-primary"
                      }}
                      numberInputProps={{
                        className: "bg-transparent outline-none ml-2",
                        required: true,
                        id: "phone"
                      }}
                      smartCaret
                      limitMaxLength
                      className="block w-full px-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus-within:ring-primary focus-within:border-primary outline-none"
                    />
                  </div>

                  <div id="email-field" className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className=" text-gray-500" />
                      </div>
                      <input
                        onChange={handleEmailChange}
                        value={formData.email}
                        type="email"
                        id="email"
                        name="email"
                        className={clsx("block w-full px-10 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none",
                          formMessages?.email?.status === "err4xx" && "!ring-2 !ring-red-500 !border-red-500"
                        )}
                        placeholder="name@company.com"
                        required
                      />
                      {(formMessages?.email?.status === "loading" || formMessages?.email?.status === "ok") && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {formMessages?.email?.status === "loading" && (
                            <LuLoaderCircle className="text-gray-500 animate-spin" />
                          )}
                          {formMessages?.email?.status === "ok" && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {(formMessages?.email?.status === "err4xx" || formMessages?.email?.status === "err5xx") && (
                      <div className="flex items-center gap-1.5 text-xs">
                        {formMessages?.email?.status === "err4xx" && (
                          <FaCircleXmark className="text-red-400" />
                        )}
                        {formMessages?.email?.status === "err5xx" && (
                          <FaExclamationTriangle className="text-orange-400" />
                        )}
                        {formMessages?.email?.message && (
                          <p className={clsx("text-xs font-[500]",
                            formMessages?.email?.status === "err4xx" && "text-red-400",
                            formMessages?.email?.status === "err5xx" && "text-orange-400",
                          )}>
                            {formMessages?.email?.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>



                  <div id="password-field" className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className=" text-gray-500" />
                      </div>
                      <input
                        onChange={(event) => setFormData(prev => ({ ...prev, password: event.target.value }))}
                        value={formData.password}
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        className="block w-full pl-10 pr-10 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {passwordVisible ?
                          <FaEyeSlash className="text-gray-500" />
                          :
                          <FaEye className="text-gray-500" />
                        }
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">* Must be at least 8 characters with 1 number and 1 special character</div>
                  </div>


                  <div id="terms-agreement" className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        className="h-4 w-4 rounded border-dark-border-primary accent-primary focus:ring-purple-light"
                        required
                      />
                    </div>
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                      I agree to the <span className="text-accent-purple hover:text-accent-green cursor-pointer">Terms of Service</span> and <span className="text-accent-purple hover:text-accent-green cursor-pointer">Privacy Policy</span>
                    </label>
                  </div>

                  <button
                    disabled={resMessages?.status === "loading" ||
                      Object.values(formMessages).some(
                        item => (item.status === "err4xx" || item.status === "err5xx" || item.status === "loading")
                      )
                    }
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    {resMessages?.status === "loading" ?
                      <Fragment>
                        <LuLoaderCircle className="mr-2 animate-spin" />
                        <span>Signing up...</span>
                      </Fragment> :
                      <Fragment>
                        <span>Create account</span>
                        <FaArrowRight className="ml-2" />
                      </Fragment>
                    }
                  </button>


                </form>

                {/* <div className="relative flex items-center mb-5">
          <div className="flex-grow border-t border-dark-border-primary"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">Or sign up with</span>
          <div className="flex-grow border-t border-dark-border-primary"></div>
        </div>

        <div id="sso-providers" className="grid grid-cols-3 gap-3">
          {ssoProviders.map((provider, index) => (
            <button
              key={index}
              type="button"
              title={`Sign up with ${provider.name}`}
              className="flex justify-center items-center py-2.5 border border-dark-border-primary rounded-lg hover:bg-gray-50/5 transition"
            >
              <provider.icon className="text-lg" />
            </button>
          ))}
        </div> */}

                <div id="login-link" className="mt-6 text-center">
                  <span className="text-gray-400">Already have an account?</span>
                  <Link
                    href={"/login"}
                    className="text-primary hover:opacity-80 ml-1 font-medium transition cursor-pointer"
                  >
                    Sign in
                  </Link>
                </div>
              </Fragment>
            )}
          </Fragment>
        )}

      </AuthLayout>
    </Fragment>
  )
}
