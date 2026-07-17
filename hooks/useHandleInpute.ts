
"use client"

import { useState } from "react";


export type HandleInputEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | { name: string; value: string }
  | any ;

export type handleInputefn_type = (e: HandleInputEvent) => void;
export type HandleInputeReturn<T extends object> = {
  value: T;
  handleInputefn: handleInputefn_type;
  setValue: React.Dispatch<React.SetStateAction<T>>;
};

const useHandleinpute = <T extends object>(initialstate: T ): HandleInputeReturn<T> => {
  let [value, setValue] = useState<T>(initialstate);

  const handleInputefn = (
    e:
      | React.ChangeEvent<
          HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
        >
      | { name: string; value: string }
  ) => {
    if ("target" in e) {
      let { name, value } = e.target;
      setValue((prev) => ({
        ...prev,
        [name]: value, // Update the state for the specific input
      }));
    } else {
      // Shadcn Select
      const { name, value: val } = e;
      setValue((prev) => ({
        ...prev,
        [name]: val,
      }));
    }
  };
  return { value, handleInputefn, setValue };
};

export default useHandleinpute;
