


export interface InputOption {
  id: string;
  inputId: string;
  name: string;
  lable?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  color?: string;
  cols?: number | null;
  className?: string;
  disabled?: boolean;
  options?: string[];
  keyname?:string;
  index?:number;
  onChange?: (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void; // for Select
}