import { useEffect, useRef, useState } from "react";
import { agentGenderOptions, descriptionTemplatesIcons, requiredAgentConfigurationFields } from "./constants";
import clsx from "clsx";
import { FaPenToSquare } from "react-icons/fa6";
import { FaChevronCircleRight, FaGlobe, FaInfoCircle, FaListUl } from "react-icons/fa";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { chatbotCustomizationsAllApiPath, chatbotDescriptionTemplatesApiPath, chatbotsApiPath, chatbotWebsitesApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { MdErrorOutline, MdOutlineReportProblem, MdOutlineSearchOff } from "react-icons/md";
import { useRouter } from "next/router";
import FieldMessage from "./FieldMessage";
import { LuBadgeCheck } from "react-icons/lu";
import { urlRegExp } from "@/constants";
import { useAuthContext } from "@/context/useAuthContext";

export default function SetupAgent({ setSelectedStep }) {

  const router = useRouter();
  const { loginUser } = useAuthContext();
  const { chatbots, chatbotConfigurations, setChatbotConfigurations, chatbotCustomizationData, setChatbotCustomizationData, chatbotStepper, setChatbotStepper, descriptionTemplates, setDescriptionTemplates } = useDashboardContext();
  const patchTimeoutRef = useRef(null);

  const [fetchingField, setFetchingField] = useState({
    description_template: {
      status: "ok",
      message: null
    }
  });
  const [formMessages, setFormMessages] = useState({
    description: {
      status: null,
      message: null
    },
    description_template: {
      status: null,
      message: null
    },
    gender: {
      status: null,
      message: null
    },
    website_url: {
      status: null,
      message: null
    }
  });

  useEffect(() => {
    if (descriptionTemplates?.length === 0) {
      getChatbotDescriptionTemplates();
    }
  }, []);

  const patchChatbotbyId = async (payload = {}, field = null) => {

    if (Object.values(payload).length === 0 || !field) return;

    setFormMessages(prev => ({
      ...prev,
      [field]: {
        ...prev?.[field],
        status: "loading",
        message: "Updating..."
      }
    }));

    const res = await createOrUpdate(payload, "PATCH", `${chatbotsApiPath}${router?.query?.id}/`, true);
    let resData = null;
    try {
      resData = await res?.json();
    }
    catch (e) { }


    if (res?.status >= 400 && res?.status < 500) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: "err4xx",
          message: resData?.message || resData?.[field]?.[0] || "Unable to update the data, Please try again."
        }
      }));
      return false;
    }

    if (res?.status >= 500) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: "err5xx",
          message: res?.message || resData?.message || "Server issue, please try again later."
        }
      }));
      return false;
    }

    if (res?.status === 200) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: null,
          message: null
        }
      }));
      return resData || {};
    }

  }


  const getChatbotDescriptionTemplates = async () => {
    setFetchingField(prev => ({
      ...prev,
      description_template: {
        ...prev.description_template,
        status: "loading"
      }
    }));

    const response = await retrieveOrRemove("GET", chatbotDescriptionTemplatesApiPath, true);

    let resData = null;
    try {
      resData = await response?.json();
    }
    catch (e) { }

    if (response?.status === 200) {

      if (resData?.length > 0) {
        setDescriptionTemplates(resData);
        setFetchingField(prev => ({
          ...prev,
          description_template: {
            ...prev.description_template,
            status: "ok",
            message: null
          }
        }));
      }
      else {
        setFetchingField(prev => ({
          ...prev,
          description_template: {
            ...prev.description_template,
            status: "ok",
            message: "No templates available."
          }
        }));
      }

      return;

    }
    if (response?.status >= 400 && response?.status < 500) {
      setFetchingField(prev => ({
        ...prev,
        description_template: {
          ...prev.description_template,
          status: "err4xx",
          message: resData?.message || "Unable to fetch description templates."
        }
      }));

      return
    }
    if (response?.status >= 500) {
      setFetchingField(prev => ({
        ...prev,
        description_template: {
          ...prev.description_template,
          status: "err5xx",
          message: response?.message || resData?.message || "Server error while fetching description templates."
        }
      }));

      return
    }


    return;
  }

  const handlePatchByField = async (field = null, value) => {
    if (!field) return;

    if (formMessages?.[field]?.status || formMessages?.[field]?.message) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev,
          status: null,
          message: null
        }
      }));
    }

    if (chatbotConfigurations?.setup?.[field] === value) return;

    setChatbotConfigurations(prev => ({
      ...prev,
      setup: {
        ...prev?.setup,
        [field]: value
      }
    }));

    if (patchTimeoutRef.current) {
      clearTimeout(patchTimeoutRef.current);
    }


    const payload = {
      [field]: value
    }

    patchTimeoutRef.current = setTimeout(async () => {

      const result = await patchChatbotbyId(payload, field);

      if (!result) {
        setChatbotConfigurations(prev => ({
          ...prev,
          setup: {
            ...prev?.setup,
            [field]: null
          }
        }));
      }
      else {
        // await getChatbotCustomizationsById();
      }
    }, 500);

  }

  const onNextClick = () => {

    const hasAnyFormMessages = Object.values(formMessages).some(
      ({ status, message }) => (status || message)
    );

    if (hasAnyFormMessages) {

      const el = document.getElementById("action-required");
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return;
    };

    let allFilled = true;

    const { setup } = requiredAgentConfigurationFields;

    setup.forEach((field) => {
      const value = chatbotConfigurations?.setup?.[field];

      if (!value) {
        allFilled = false;
        setFormMessages((prev) => ({
          ...prev,
          [field]: {
            ...prev?.[field],
            message: "This field is required...!!!",
            status: "required",
          },
        }));
      }
    });

    setChatbotStepper(prev =>
      prev?.map(item =>
        item.id === "setup" ? { ...item, completed: allFilled } : item
      )
    );

    if (allFilled) {
      const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "setup");
      if ((currentStepIndex + 1) < chatbotStepper?.length) {
        setSelectedStep(chatbotStepper?.[currentStepIndex + 1]?.id);
      }
      return;
    }
    else {
      setTimeout(() => {
        const el = document.getElementById("action-required");
        if (el) {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }, 100);
      return;
    }
  };

  const onWebsiteUrlChange = async (event) => {
    if (formMessages?.website_url?.status || formMessages?.website_url?.message) {
      setFormMessages(prev => ({
        ...prev,
        website_url: {
          ...prev,
          status: null,
          message: null
        }
      }));
    }

    setChatbotConfigurations(prev => ({
      ...prev,
      setup: {
        ...prev?.setup,
        website_url: event.target.value
      }
    }));

    if (patchTimeoutRef.current) {
      clearTimeout(patchTimeoutRef.current);
    }

    patchTimeoutRef.current = setTimeout(async () => {

      if (!urlRegExp.test(event.target.value)) {
        setFormMessages(prev => ({
          ...prev,
          website_url: {
            ...prev,
            status: "required",
            message: "Please enter an valid URL to proceed...!!!"
          }
        }));
        return;
      }

      const url = new URL(event.target.value);
      const payload = {
        url: event.target.value,
        company: loginUser?.company_profile_id,
        name: url?.hostname || event.target.value,
        chatbot: router.query?.id ,

      }

      const result = await createChatbotWebsite(payload, "website_url");
      if (!result) {
        setChatbotConfigurations(prev => ({
          ...prev,
          setup: {
            ...prev?.setup,
            website_url: ""
          }
        }));
      }
      else {
        setChatbotCustomizationData(prev => ({
          ...prev,
          website_url: result?.url || ""
        }))
        // await getChatbotCustomizationsById();
      }

    }, 1000);
  }

  const createChatbotWebsite = async (payload = {}, field = null) => {
    if (Object.values(payload).length === 0 || !field) return;

    setFormMessages(prev => ({
      ...prev,
      [field]: {
        ...prev?.[field],
        status: "loading",
        message: "Creating your website... Please wait."
      }
    }));

    const res = await createOrUpdate(payload, "POST", chatbotWebsitesApiPath, true);
    let resData = null;
    try {
      resData = await res?.json();
    }
    catch (e) { }

    if (res?.status >= 400 && res?.status < 500) {

      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: "err4xx",
          message: resData?.message || "Invalid input, please check and try again."
        }
      }));

      return false;

    }

    if (res?.status >= 500) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: "err5xx",
          message: res?.message || resData?.message || "Server issue, please try again later."
        }
      }));

      return false;

    }

    if (res?.status === 201) {
      setFormMessages(prev => ({
        ...prev,
        [field]: {
          ...prev?.[field],
          status: null,
          message: null
        }
      }));
      return resData;
    }

  }

  return (
    <div
      className={clsx("xl:w-[85%] w-full mx-auto transform transition-all duration-300 ")}
    >

      <div id="sectionA" className="mb-6">
        <h3 className="text-xl font-medium mb-2">Enter the Website URL</h3>
        <p className="dark:text-dark-text-secondary text-light-text-secondary mb-4">Provide the URL of the website you want your agent to learn from</p>

        <div className=" bg-light-card-primary shadow rounded-lg p-5 border border-light-border-primary">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="relative flex items-center">
                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2  text-secondary" />
                <input
                  type="text"
                  value={chatbotConfigurations?.setup?.website_url}
                  onChange={(event) => onWebsiteUrlChange(event)}
                  placeholder="https://example.com"
                  disabled={(chatbotCustomizationData?.website_url || formMessages?.website_url?.status === "loading") ? true : false}
                  className="w-full bg-light-bg-primary border border-light-border-primary rounded-lg pl-10 pr-4 py-3 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none disabled:cursor-not-allowed"
                />

                {(chatbotCustomizationData?.website_url) && (
                  <LuBadgeCheck
                    title="Verified"
                    className="text-green-400 font-[500] size-6 ml-2"
                  />
                )}

              </div>

              <FieldMessage data={formMessages?.website_url} />
            </div>
          </div>
          <div className="mt-4 text-sm dark:text-dark-text-secondary text-light-text-secondary">
            <p className="flex items-center">
              <FaInfoCircle className="mr-2 text-light-text-secondary" />
              Make sure the website is publicly accessible and contains relevant information for your agent.
            </p>
          </div>
        </div>
      </div>

      <div id="sectionB" className="mb-6">
        <h3 className="text-xl font-medium mb-2">Chatbot Description</h3>
        <p className="text-light-text-secondary mb-4">Describe your agent's personality and capabilities</p>

        <div className="flex flex-col space-y-4">
          <div className="dark:bg-dark-bg-primary bg-light-card-primary rounded-lg p-5 border border-light-border-primary shadow">
            <h4 className="font-medium mb-3 flex items-center">
              <FaPenToSquare className="mr-2" />
              Write your own
            </h4>
            <textarea
              onChange={(e) => handlePatchByField("description", e.target.value)}
              value={chatbotConfigurations?.setup?.description}
              rows="3"
              placeholder="Describe your agent's personality, tone, and how it should respond..."
              className="w-full bg-light-bg-primary border border-light-border-primary rounded-lg p-4 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none"
            />
            <FieldMessage
              data={formMessages?.description}
            />
          </div>

          <div className="bg-light-card-primary rounded-lg p-5 border border-light-border-primary shadow">
            <h4 className="font-medium mb-3 flex items-center">
              <FaListUl className="mr-2" />
              Choose from categories
            </h4>


            {fetchingField?.description_template?.status === "loading" && (
              <DescriptionTemplateSkeleton />
            )}

            {fetchingField?.description_template?.status === "err4xx" && (
              <div className="p-4 flex mx-auto max-w-md items-center justify-center flex-col bg-light-bg-primary rounded-lg">
                <MdErrorOutline
                  className="text-red-400 size-10 mb-2"
                />

                <p className="text-lg mb-2.5 font-[500]">
                  {fetchingField?.description_template.message}
                </p>

                <button
                  onClick={async () => await getChatbotDescriptionTemplates()}
                  type="button"
                  className="px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500]"
                >
                  Reload
                </button>
              </div>
            )}

            {fetchingField?.description_template?.status === "err5xx" && (
              <div className="p-4 flex mx-auto max-w-md items-center justify-center flex-col bg-light-bg-primary rounded-lg">
                <MdOutlineReportProblem
                  className="text-orange-400 size-10 mb-2"
                />

                <p className="text-lg mb-2.5 font-[500]">
                  {fetchingField?.description_template.message}
                </p>

                <button
                  onClick={async () => await getChatbotDescriptionTemplates()}
                  type="button"
                  className="px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500]"
                >
                  Reload
                </button>
              </div>
            )}

            {fetchingField?.description_template?.status === "ok" && (
              descriptionTemplates.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {descriptionTemplates.map((template) => (
                    <button
                      onClick={() => handlePatchByField("description_template", template.id)}
                      key={template.id}
                      className={clsx(" bg-light-bg-primary p-3 rounded-lg border border-light-border-primary cursor-pointer text-left",
                        template.id === chatbotConfigurations?.setup?.description_template ? "border-secondary" : "border-light-border-primary hover:border-secondary"
                      )}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3 text-secondary">
                          {descriptionTemplatesIcons?.[template?.title]?.icon}
                        </span>
                        <div>
                          <h5 className="font-medium">{template.title}</h5>
                          <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) :
                (
                  <div className="p-4 flex mx-auto max-w-md items-center justify-center flex-col  bg-light-bg-primary rounded-lg">
                    <MdOutlineSearchOff
                      className="text-secondary size-10 mb-2"
                    />

                    <p className="text-lg mb-2.5 font-[500] text-center">
                      {fetchingField?.description_template.message}
                    </p>

                    <button
                      onClick={async () => await getChatbotDescriptionTemplates()}
                      type="button"
                      className="px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500]"
                    >
                      Reload
                    </button>
                  </div>
                )
            )}
            <FieldMessage
              data={formMessages?.description_template}
            />
          </div>
        </div>
      </div>

      <div id="sectionC" className="mb-6">
        <h3 className="text-xl font-medium mb-2">Chatbot Gender</h3>
        <p className="text-light-text-secondary mb-4">Select a gender for your agent's voice and persona</p>

        <div className="flex flex-wrap gap-4">
          {agentGenderOptions.map((gender) => (
            <button
              onClick={() => handlePatchByField("gender", gender.id)}
              key={gender.id}
              className={clsx("flex-1 min-w-[120px]  bg-light-card-primary shadow rounded-lg p-4 border-2 cursor-pointer hover-elevate",
                gender.id === chatbotConfigurations?.setup?.gender ? "border-secondary" : "border-light-border-primary"
              )}
            >
              <div className="flex flex-col items-center text-center">
                <gender.icon className="text-2xl text-primary mb-2" />
                <span>{gender.name}</span>
              </div>
            </button>
          ))}

        </div>

        <FieldMessage
          data={formMessages?.gender}
        />
      </div>

      <button
        onClick={onNextClick}
        className="ml-auto flex justify-center w-max items-center gap-2 px-4 py-2 rounded-full from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate font-[500]"
      >
        Next
        <FaChevronCircleRight />
      </button>

    </div>
  )
}


const DescriptionTemplateSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={clsx("bg-light-bg-primary p-3 rounded-lg border cursor-pointer text-left border-light-border-primary")}
        >
          <div className="flex items-start animate-pulse">
            <span className="block size-6 rounded-full flex-shrink-0 bg-secondary/20 mr-3" />
            <div className="w-full">
              <span className="block w-10/12 h-2.5 rounded-sm dark:bg-gray-800 bg-gray-200 mb-2" />
              <span className="block w-full h-6 rounded-md dark:bg-gray-800 bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
