import config from "./app-env.config.json";

interface ConfigType {
  ENV: "local" | "dev" | "staging" | "production";
  APP_ID: string;
  API_URL_HODOOENG: string;
  API_URL_AUTH: string;
  API_URL_DDANGKONG: string;
  URL_DDANGKONG: string;
  URL_HODOOSCHOOL: string;
  API_URL_BILLING: string;
  API_URL_HODOO_MEMBERSHIP: string;
  IMG_URL: string;
  WAV_URL: string;
  CHARACTER_IMG_URL: string;
  GoogleSignin_WEB_CLIENT_Id: string;
  NaverLogin_Client_Id: string;
  AppleLogin_Client_Id: string;
  Kakao_JS_Key: string;
  IMP_USER_CODE: string;
  CMS_URL: string;
  CMS_TOKEN: string;
}

const ENV_MAP: { [key: string]: ConfigType } = {
  local: {
    ENV: "local",
    APP_ID: "hodoo_school",
    API_URL_HODOOENG: "https://dev.hodooenglish.com",
    API_URL_AUTH: "https://devauthapi.hodooenglish.com/",
    API_URL_DDANGKONG: "https://dev-api.ddangkongschool.com",
    URL_DDANGKONG: "https://dev.ddangkongschool.com",
    API_URL_BILLING: "https://dev-billing.hodooenglish.com",
    API_URL_HODOO_MEMBERSHIP: "https://dev-membership.hodooschool.com",
    IMG_URL: "https://static.hodooenglish.com",
    // 테스트 때문에 임시 prod로
    WAV_URL: "https://voice.hodooenglish.com/prod",
    CHARACTER_IMG_URL:
      "https://static.hodooenglish.com/static/imgs/front/about/npc",
    GoogleSignin_WEB_CLIENT_Id:
      "518511820247-velrv6rqs6amoq34ci5vmedt1akbq0u5.apps.googleusercontent.com", // 호두 웹
    // GoogleSignin_WEB_CLIENT_Id: '727029753931-1sl2r3ct69k75kifufsru9mh4ku0gpmi.apps.googleusercontent.com', // hodoo스쿨
    NaverLogin_Client_Id: "IVbD22RR9LNEXUUgjvAw",
    AppleLogin_Client_Id: "com.hodoolabs.hodoomembersservice",
    URL_HODOOSCHOOL: "https://dev.hodooschool.com",
    Kakao_JS_Key: "bca51797b3591d6dca25be0e101428f4",
    IMP_USER_CODE: "imp80930725",
    CMS_URL: "https://cms-dev.hodooschool.com",
    CMS_TOKEN:
      // eslint-disable-next-line max-len
      "d79246b55ddeccae1091bd959b717722f07d8fb0a6a92dabfe22db35a144846f3d5446033caf3fe9cdc9ef18c8e15ebd90d11043ce8882e067eec3d4dca9abcfae3039361df6882da51ce6b84c9b8c659c701ad0e0595e0d8ef8f0fcda9855f5a4cb0547af8f18db76534ef658f0cc0316d695e344abc53409b694c17a05cac9",
  },
  development: {
    ENV: "dev",
    APP_ID: "hodoo_school",
    API_URL_HODOOENG: "https://dev.hodooenglish.com",
    API_URL_AUTH: "https://devauthapi.hodooenglish.com/",
    API_URL_DDANGKONG: "https://dev-api.ddangkongschool.com",
    URL_DDANGKONG: "https://dev.ddangkongschool.com",
    API_URL_BILLING: "https://dev-billing.hodooenglish.com",
    API_URL_HODOO_MEMBERSHIP: "https://dev-membership.hodooschool.com",
    IMG_URL: "https://static.hodooenglish.com",
    // 테스트 때문에 임시 prod로
    WAV_URL: "https://voice.hodooenglish.com/prod",
    CHARACTER_IMG_URL:
      "https://static.hodooenglish.com/static/imgs/front/about/npc",
    GoogleSignin_WEB_CLIENT_Id:
      "518511820247-velrv6rqs6amoq34ci5vmedt1akbq0u5.apps.googleusercontent.com", // 호두 웹
    // GoogleSignin_WEB_CLIENT_Id: '727029753931-1sl2r3ct69k75kifufsru9mh4ku0gpmi.apps.googleusercontent.com', // hodoo스쿨
    NaverLogin_Client_Id: "IVbD22RR9LNEXUUgjvAw",
    AppleLogin_Client_Id: "com.hodoolabs.hodoomembersservice",
    URL_HODOOSCHOOL: "https://dev.hodooschool.com",
    Kakao_JS_Key: "bca51797b3591d6dca25be0e101428f4",
    IMP_USER_CODE: "imp80930725",
    CMS_URL: "https://cms-dev.hodooschool.com",
    CMS_TOKEN:
      // eslint-disable-next-line max-len
      "d79246b55ddeccae1091bd959b717722f07d8fb0a6a92dabfe22db35a144846f3d5446033caf3fe9cdc9ef18c8e15ebd90d11043ce8882e067eec3d4dca9abcfae3039361df6882da51ce6b84c9b8c659c701ad0e0595e0d8ef8f0fcda9855f5a4cb0547af8f18db76534ef658f0cc0316d695e344abc53409b694c17a05cac9",
  },
  staging: {
    ENV: "staging",
    APP_ID: "hodoo_school",
    API_URL_HODOOENG: "https://stg.hodooenglish.com",
    API_URL_AUTH: "https://stgauthapi.hodooenglish.com/",
    API_URL_DDANGKONG: "https://stag-api.ddangkongschool.com",
    URL_DDANGKONG: "https://stg.ddangkongschool.com",
    API_URL_BILLING: "https://stag-billing.hodooenglish.com",
    API_URL_HODOO_MEMBERSHIP: "https://stag-membership.hodooschool.com",
    IMG_URL: "https://static.hodooenglish.com",
    WAV_URL: "https://voice.hodooenglish.com/stg",
    CHARACTER_IMG_URL:
      "https://static.hodooenglish.com/static/imgs/front/about/npc",
    GoogleSignin_WEB_CLIENT_Id:
      "357449408056-ds94usftv8gojhlchbq616bt51mp1scf.apps.googleusercontent.com", // DKS
    NaverLogin_Client_Id: "IVbD22RR9LNEXUUgjvAw",
    AppleLogin_Client_Id: "com.hodoolabs.hodoomembersservice",
    URL_HODOOSCHOOL: "https://stg.hodooschool.com",
    Kakao_JS_Key: "bca51797b3591d6dca25be0e101428f4",
    IMP_USER_CODE: "imp30324829",
    CMS_URL: "https://cms-dev.hodooschool.com",
    CMS_TOKEN:
      // eslint-disable-next-line max-len
      "d79246b55ddeccae1091bd959b717722f07d8fb0a6a92dabfe22db35a144846f3d5446033caf3fe9cdc9ef18c8e15ebd90d11043ce8882e067eec3d4dca9abcfae3039361df6882da51ce6b84c9b8c659c701ad0e0595e0d8ef8f0fcda9855f5a4cb0547af8f18db76534ef658f0cc0316d695e344abc53409b694c17a05cac9",
  },
  production: {
    ENV: "production",
    APP_ID: "hodoo_school",
    API_URL_HODOOENG: "https://hodooenglish.com",
    API_URL_AUTH: "https://authapi.hodooenglish.com",
    API_URL_DDANGKONG: "https://api.ddangkongschool.com",
    URL_DDANGKONG: "https://book.hodooschool.com",
    API_URL_BILLING: "https://billing.hodooenglish.com",
    API_URL_HODOO_MEMBERSHIP: "https://membership.hodooschool.com",
    IMG_URL: "https://static.hodooenglish.com",
    WAV_URL: "https://voice.hodooenglish.com/prod",
    CHARACTER_IMG_URL:
      "https://static.hodooenglish.com/static/imgs/front/about/npc",
    GoogleSignin_WEB_CLIENT_Id:
      "926374297912-o98smppb4fnalp70teqpeqdodcu12krh.apps.googleusercontent.com", //DKS
    NaverLogin_Client_Id: "IVbD22RR9LNEXUUgjvAw",
    AppleLogin_Client_Id: "com.hodoolabs.hodoomembersservice",
    URL_HODOOSCHOOL: "https://hodooschool.com",
    Kakao_JS_Key: "bca51797b3591d6dca25be0e101428f4",
    IMP_USER_CODE: "imp16726556",
    CMS_URL: "https://cms.hodooschool.com",
    CMS_TOKEN:
      // eslint-disable-next-line max-len
      "4b61fa2753e63afe2ac153768f08dfcc91e08b7583d72ad1bb703c5b99a6e80fe64a1d485718e6950fa8843e09a05aeef63a77220022a024a4ddebc1efefe73c3ef5597c78763e7a99416a7353720b5550ea161c1072a0263ed6ec4ec6566fdf6bbc3fa023ff6db5ab217150c9be66da506137b069c1d35fe6f576cdace68cef",
  },
};

export default ENV_MAP[config.VITE_ENV] || ENV_MAP.development;
