// Authentication paths
export const loginApiPath = "/accounts/login/";
export const signUpApiPath = "/accounts/signup/";
export const logoutApiPath = "/accounts/logout/";
export const signUpVerifyApiPath = "/accounts/signup-verify/<id>/";
export const userInfoApiPath = "/accounts/user-info/";
export const usersApiPath = "/accounts/users/<id>/";
export const isEmailExistsApiPath = "/accounts/is-email-exists/";
export const googleSSOApiPath = "/accounts/google/"
export const forgetPasswordApiPath = "/accounts/forget-password/";
export const resetPasswordApiPath = "/accounts/reset-password/";
export const companyProfilesApiPath = "/accounts/company-profiles/";

// Analytics
export const contactUsApiPath = "/analytics/contact-us/";
export const leadCollectorApiPath = "/analytics/lead-collector/";

// chatbots API paths
export const avatarModelsApiPath = "/chatbot/chatbot-avatars/";
export const chatSessionsApiPath = "/chatbot/chat-sessions/";
export const chatSessionsWithConversationsApiPath = "/chatbot/chat-sessions/<id>/with_conversations/"
export const chatPanelImagesApiPath = "/chatbot/chat-panel-images/";
export const chatPanelCustomerImagesApiPath = "/chatbot/chat-panel-customer-images/";
export const chatPanelVideosApiPath = "/chatbot/chat-panel-videos/";
export const chatPanelCustomerVideosApiPath = "/chatbot/chat-panel-customer-videos/";
export const chatbotVoicesApiPath = "/chatbot/chatbot-voices/";
export const chatbotBotApiPath = "/chatbot/bot/";
export const chatbotDescriptionTemplatesApiPath = "/chatbot/chatbot-description-templates/"
export const chatbotRoomApiPath = "/chatbot/room";
export const chatbotsApiPath = "/chatbot/chatbots/";
export const chatbotCustomizationsWebsiteApiPath = "/chatbot/customizations/website/"
export const chatbotCustomizationsthreeDApiPath = "/chatbot/customizations/three-d/"
export const chatbotCustomizationsAllApiPath = "/chatbot/customizations/all/";
export const chatbotWebsitesApiPath = "/chatbot/websites/";
export const chatbotSitemapApiPath = "/chatbot/sitemap/";
export const chatbotSitemapProcessingStatusApiPath = "/chatbot/sitemap-processing-status/";
export const chatbotDashboardApiPath = "/chatbot/dashboard/";
export const chatbotFacebookPageListApiPath = "/chatbot/get-facebook-page-list/"
export const chatbotCustomizationsFacebookApiPath = "/chatbot/customizations/facebook/"
export const chatbotCustomizationsDisconnectFacebookApiPath = "/chatbot/customizations/facebook/<id>/disconnect/"
export const chatbotInstagramPageListApiPath = "/chatbot/customizations/instagram/get-instagram-page-list/"
export const chatbotCustomizationsInstagramApiPath = "/chatbot/customizations/instagram/"
export const chatbotCustomizationsDisconnectInstagramApiPath = "/chatbot/customizations/instagram/<id>/disconnect/"

// Agents API Paths
export const agentChatApiPath = "/agent/agent-chat/";
export const agentChatSessionsApiPath = "/agent/agent-chat-session/";
export const agentChatSessionWithConversationsApiPath = "/agent/agent-chat-session/<id>/with_conversations/";
export const agentIntegrationForUserApiPath = "/agent/integration/for_user/";
export const agentOauthUrlApiPath = "/agent/oauth/auth-url/";
export const agentOauthCallbackApiPath = "/agent/oauth/callback/";
export const agentIntegrationDisconnectApiPath = "/agent/integration/<id>/disconnect/";
export const dashboardChatSession = "/agent/dashboard-chat-session/";
export const dashboardNewSession = "/agent/dashboard-chat/";
export const dashboard = "/agent/create-dashboard/";
export const agentCustomerApiKeyApiPath = "/agent/customer-api-key/";
export const agentCustomerDatabaseCredentialApiPath = "/agent/customer-database-credential/";

// payment api
export const stripeCreateSubscriptionApiPath = "/payment/stripe/create-subscription/";
export const razorpayCreateSubscriptionApiPath = "/payment/razorpay/create-subscription/";
export const stripeCreateCheckoutSession = "/payment/stripe/create-checkout-session/";
export const razorpayCreatePaymentLink = "/payment/razorpay/create-payment-link/";
export const createTrialSubscriptionApiPath = "/payment/create-trial-subscription/"
export const cancelSubscriptionApiPath = "/payment/cancel-subscription/";

// Blogs API
export const blogsApiPath = "/blog/";
export const blogNameApiPath = "/blog/name/";

//websockets
export const websocketVoiceApiPath = "/<roomId>/speech/";
export const websocketNotificationApiPath = "/<company_profile_id>/notifications/";

// User activity paths
export const visitorApiPath = '/analytics/visitor/'
export const visitApiPath = '/analytics/visit/'
export const visitPageApiPath = "/analytics/visit-page/"
export const visitPageActionApiPath = "/analytics/visit-page-action/"
export const conversionTrackingApiPath = "/analytics/conversion-tracking/"




