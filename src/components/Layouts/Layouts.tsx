import { colors, device, hodooEnglishColors } from "../../theme";

import styled from "@emotion/styled";

// 모든 페이지에서 사용하는 최상위 컨테이너
export const MainContainer = styled.div`
  display: flex;
  flex: 1;
  /* align-self: stretch; */
  /* overflow: scroll; */
  /* width: 100%; */
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  /* border: 5px solid black; */
  position: relative;
`;

export const MainContentContainer = styled.div`
  width: 100%;
  // desktop
  @media ${device.tablet} {
  }
`;

export const Section = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 60px;
  @media ${device.tablet} {
    margin-top: 80px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 100%;
  // mobile
  width: auto;

  // tablet
  @media ${device.tablet} {
    /* max-width: 768px; */
    padding-left: 30px;
    padding-right: 30px;
  }
  /* min-width: 1200px; */
  /* max-width: 1200px; */

  // desktop
  @media ${device.desktop} {
    max-width: 1260px;
    padding-left: 30;
    padding-right: 30;
    margin: 0 auto;
  }
  /* border: 4px solid green; */
`;

export const SlideWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: scroll;
  white-space: nowrap;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;

export const Footnote = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 16px;
    line-height: 28px;
  }
`;

export const TitleText1B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 60px;
    line-height: 84px;
    letter-spacing: 0px;
  }
`;

export const TitleText2B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 32px;
  line-height: 44px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 50px;
    line-height: 72px;
  }
`;

export const SubtitleText1B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  white-space: pre-wrap;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 32px;
    line-height: 44px;
  }
`;

export const SubtitleText2B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 24px;
    line-height: 36px;
  }
`;

export const SubtitleText4B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 16px;
  line-height: 28px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 20px;
    line-height: 32px;
  }
`;

export const SubtitleText3SB = styled.span`
  // mobile
  font-family: Pretendard;
  white-space: pre-wrap;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 24px;
    line-height: 36px;
  }
`;

export const SubtitleText6M = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  word-break: keep-all;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 20px;
    line-height: 32px;
  }
`;

export const SubtitleText7B = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 16px;
    line-height: 28px;
  }
`;

export const SubtitleText5SB = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 20px;
    line-height: 32px;
  }
`;

export const Body1R = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 24px;
    line-height: 36px;
  }
`;

export const Body2R = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 20px;
    line-height: 32px;
  }
`;

export const Body3M = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 16px;
    line-height: 28px;
  }
`;

export const Body4R = styled.span`
  // mobile
  white-space: pre-wrap;
  font-family: Pretendard;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 16px;
    line-height: 28px;
  }
`;

export const Caption1M = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 14px;
    line-height: 24px;
  }
`;

export const Caption2R = styled.span`
  // mobile
  font-family: Pretendard;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${colors.gray100};
  // tablet
  @media ${device.tablet} {
    font-size: 14px;
    line-height: 24px;
  }
`;

export const LargeTitle = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-family: Pretendard;
  font-weight: 800;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 28px;
  line-height: 40px;

  letter-spacing: 0px;

  // tablet
  @media ${device.tablet} {
    font-size: 30px;
    line-height: 40px;
    letter-spacing: 0px;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 60px;
    line-height: 78px;
    letter-spacing: -1px;
  }
`;

export const Title = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-weight: bold;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 20px;
  line-height: 32px;

  // tablet
  @media ${device.tablet} {
    font-size: 24px;
    line-height: 38px;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 32px;
    line-height: 48px;
  }
`;

export const Subtitle = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-weight: normal;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 20px;
  line-height: 30px;

  // tablet
  @media ${device.tablet} {
    font-size: 24px;
    line-height: 30px;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 32px;
    line-height: 40px;
  }
`;

export const Body = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-weight: normal;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 16px;
  line-height: 24px;
  text-align: center;

  // tablet
  @media ${device.tablet} {
    font-size: 17px;
    line-height: 24px;
    text-align: center;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 24px;
    line-height: 38px;
  }
`;

export const Caption1 = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-weight: bold;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 14px;
  line-height: 20px;

  // tablet
  @media ${device.tablet} {
    font-size: 15px;
    line-height: 20px;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 20px;
    line-height: 30px;
  }
`;

export const Caption2 = styled.span`
  /* HD / LargeTitle */
  font-style: normal;
  font-weight: normal;
  color: ${hodooEnglishColors.shade700};

  // mobile
  font-size: 14px;
  line-height: 26px;

  // tablet
  @media ${device.tablet} {
    font-size: 15px;
    line-height: 26px;
  }
  // desktop
  @media ${device.desktop} {
    font-size: 20px;
    line-height: 36px;
  }
`;

export const ButtonLargeMediumB = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 16px; //PC, M 동일
  line-height: 28px; //PC, M 동일
  /* identical to box height, or 175% */

  color: #121d26;
`;
