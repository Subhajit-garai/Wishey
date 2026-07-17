import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input as TextInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { type handleInputefn_type } from "@/hooks/useHandleInpute";
import { type InputOption } from "@/types/Input";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  handleInputefn?: handleInputefn_type;
  value: Record<string, string> | string | any;
  options: InputOption[];
  color?: string;
  lableClass?: string;
  containerClass?: string;
  className?: string;
}

export const SelectionInput = ({
  handleInputefn,
  value,
  options,
  lableClass,
  containerClass,
}: Props) => {
  options = Array.isArray(options) ? options : [options];

  return (
    <>
      {options.map((option: InputOption) => {
        const currentValue =
          typeof value === "string"
            ? value
            : Array.isArray(value)
              ? value[option.index ?? 0]?.[option.name] ?? ""
              : value?.[option.name] ?? "";

        return (
          <div key={option.id} className={cn("", containerClass)}>
            <div className={cn("", lableClass)}>
              <Label htmlFor={option.id}> {option.lable} </Label>
            </div>
            <Select
              disabled={option.disabled}
              key={option.inputId}
              required={option.required}
              value={currentValue}
              onValueChange={(value) => {
                if (!handleInputefn) return;

                if (option.index === undefined) {
                  handleInputefn({ name: option.name, value: value });
                } else if (option.keyname) {
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    key: option.keyname,
                    value: value,
                  });
                } else {
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    value: value,
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={option.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{option.name}</SelectLabel>
                  {option?.options?.map((item: string, idx) =>
                    <SelectItem key={idx} value={item}>
                      {item}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </>
  );
};

export const TextAreainput = ({
  handleInputefn,
  value,
  options,
  lableClass,
  containerClass,
  className,
}: Props) => {
  options = Array.isArray(options) ? options : [options];

  return (
    <>
      {options.map((option) => {
        const currentValue =
          typeof value === "string"
            ? value
            : Array.isArray(value)
              ? value[option.index ?? 0]?.[option.name] ?? ""
              : value?.[option.name] ?? "";
        return (
          <div key={option.id} className={cn("", containerClass)}>
            <div className={cn("", lableClass)}>
              <Label htmlFor={option.id}> {option.lable} </Label>
            </div>
            <Textarea
              className={cn(className)}
              name={option.name}
              id={option.inputId}
              placeholder={option.placeholder}
              required={option.required}
              color={option.color}
              cols={option.cols || 20}
              // onChange={handleInputefn}
              onChange={(e) => {
                if (!handleInputefn) return;

                if (option.index === undefined) {
                  handleInputefn(e);
                } else if (option.keyname) {
                  let value = e.target.value;
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    key: option.keyname,
                    value: value,
                  });
                } else {
                  let value = e.target.value;
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    value: value,
                  });
                }
              }}
              // value={typeof value === "string" ? value : value[option.name]}
              value={currentValue}
              disabled={option.disabled}
            />
          </div>
        );
      })}
    </>
  );
};

export const Textinput = ({
  handleInputefn,
  value,
  options,
  lableClass,
  containerClass,
}: Props) => {
  options = Array.isArray(options) ? options : [options];

  return (
    <>
      {options.map((option) => {
        const currentValue =
          typeof value === "string"
            ? value
            : Array.isArray(value)
              ? value[option.index ?? 0]?.[option.name] ?? ""
              : value?.[option.name] ?? "";

        return (
          <div key={option.id} className={cn("", containerClass)}>
            <div className={cn("", lableClass)}>
              <Label htmlFor={option.id}> {option.lable} </Label>
            </div>

            <TextInput
              name={option.name}
              id={option.inputId}
              placeholder={option.placeholder}
              required={option.required}
              color={option.color}
              size={option.cols || 20}
              onChange={(e) => {
                if (!handleInputefn) return;

                if (option.index === undefined) {
                  handleInputefn(e);
                } else if (option.keyname) {
                  let value = e.target.value;
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    key: option.keyname,
                    value: value,
                  });
                } else {
                  let value = e.target.value;
                  handleInputefn({
                    name: option.name,
                    index: option.index,
                    value: value,
                  });
                }
              }}
              value={currentValue}
              type={option.type}
              className={option.className}
              disabled={option.disabled}
            />
          </div>
        );
      })}
    </>
  );
};

export const CheckBoxInput = ({ text, Check, onCheckedChange, ...props }: any) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox id="Checkbox" checked={Check} onCheckedChange={onCheckedChange} {...props} />
        <Label htmlFor="accept" className="flex">
          {text}
        </Label>
      </div>
    </>
  );
};

export default Textinput;
