import { Ref } from "vue"

export interface FormField {
    id: string,
    label: string
    type: string
    binding: Ref
}

export interface ValidatingFormField extends FormField {
    errorMessage: string,
    validatingFunction: (value: string) => boolean,
    statusBinding: Ref,
}