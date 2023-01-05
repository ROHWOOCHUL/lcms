import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocalScreenTack } from "../GlobalContext";
interface Props {
  sharingScreen: boolean;
  sharingDiv: any;
}
const ScreenSharing = (props: Props) => {
  const localScreenTrack = useLocalScreenTack();
  //   const init = async () => {
  //     (await props.sharingScreen) &&
  //       localScreenTrack.current &&
  //       localScreenTrack.current.play(props.sharingDiv.current);
  //   };
  //   useEffect(() => {
  //     console.log(localScreenTrack, localScreenTrack.current);
  //     init();
  //   }, [props.sharingScreen]);

  return (
    <motion.div
      style={{ width: "100%" }}
      animate={{ height: props.sharingScreen ? "500px" : "0px" }}
      ref={props.sharingDiv}
    ></motion.div>
  );
};

export default ScreenSharing;
