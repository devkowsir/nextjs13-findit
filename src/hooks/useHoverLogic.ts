import axios from "axios";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface useHoverLogicProps {
  ref: RefObject<HTMLElement>;
  searchUrl: string;
  setData: Dispatch<SetStateAction<any>>;
  data: any;
}

const useHoverLogic = ({
  ref,
  searchUrl,
  setData,
  data,
}: useHoverLogicProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const refCurrent = ref.current;

  useEffect(() => {
    if (!refCurrent) return;
    let enterTimeOut: NodeJS.Timeout | undefined;
    let leaveTimeOut: NodeJS.Timeout | undefined;

    const fetchHandler = async () => {
      const { data } = await axios.get(searchUrl);
      setData(data);
    };

    function mouseEnterHander() {
      if (enterTimeOut) return;

      if (leaveTimeOut) {
        clearTimeout(leaveTimeOut);
        leaveTimeOut = undefined;
      }
      enterTimeOut = setTimeout(() => {
        setIsVisible(true);
        if (!data) fetchHandler();
      }, 200);
    }
    function mouseLeaveHander() {
      if (leaveTimeOut) return;

      if (enterTimeOut) {
        clearTimeout(enterTimeOut);
        enterTimeOut = undefined;
      }
      leaveTimeOut = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
    refCurrent.addEventListener("mouseenter", mouseEnterHander);
    refCurrent.addEventListener("mouseleave", mouseLeaveHander);

    return () => {
      refCurrent.removeEventListener("mouseenter", mouseEnterHander);
      refCurrent.removeEventListener("mouseleave", mouseLeaveHander);
    };
  }, [refCurrent, data]);

  return { isVisible };
};

export default useHoverLogic;
