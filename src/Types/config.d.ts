interface IQuestion {
    custom_id: string;
    embed: string;
    label: string;
    style: TextInputStyle;
    placeholder?: string;
    min_length?: number;
    max_length?: number;
    require?: boolean;
}

interface ISetRole {
    disabled?: boolean;
    role: string;
    log?: string;
    modalLabel: string;
    description?: string;
    label?: string;
    emoji?: string;
    question: string[];
}
